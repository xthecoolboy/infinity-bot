const Commando = require('discord.js-commando')
const ytdl = require('ytdl-core')
const YouTube = require('simple-youtube-api')
const Song = require('../../struct/Song.js')

const config = require('../../conf.json')

module.exports = class AddQueueCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'add',
      group: 'voice',
      memberName: 'add',
      aliases: ['req',
        'request',
        'rq'],
      description: 'Adds song to the queue, or plays instantly if no queue.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'userInput',
          prompt: 'Paste in the link of a YouTube URL, or enter a YouTube search query',
          type: 'string'
        }
      ]
    })
    this.queue = new Map()
    this.youtube = new YouTube(config.googleAPIKey)
  }
  async run (msg, args) {
    const userInput = args.userInput
    const queue = this.queue.get(msg.guild.id)

    let voiceChannel
    let response
    if (!queue) {
      voiceChannel = msg.member.voiceChannel
      if (!voiceChannel) {
        return msg.reply('join a voice channel first, ya dingus!')
      }
      const botPerms = await voiceChannel.permissionsFor(this.client.user)
      if (!botPerms.has('CONNECT')) {
        return msg.channel.send({embed: {
          color: 15158332,
          fields: [{
            name: `Whoops...`,
            value: `I can't connect to your channel... Ask an Admin for help.`
          }]
        }})
      }
      if (!botPerms.has('SPEAK')) {
        return msg.channel.send({embed: {
          color: 15158332,
          fields: [{
            name: `Whoops...`,
            value: `I can't speak in your channel... Ask an Admin for help.`
          }]
        }})
      }
    } else if (voiceChannel !== queue.voiceChannel && !msg.member.permissions.has('MANAGE_ROLES')) {
      const prefix = this.client.provider.get(msg.guild.id, 'prefix')
      response = await msg.channel.send({embed: {
        color: 10038562,
        title: `Error joining channel...`,
        description: `You're not in my channel. Either join my channel, or move me using ${prefix}mv.
          Type \`${prefix}help move\` for more info.`
      }})
      response.delete(5000)
      msg.delete(5000)
      return
    }

    const status = await msg.reply('getting video details, one moment...')
    if (userInput.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await this.youtube.getPlaylist(userInput)
      return this.handlePlaylist(msg, status, queue, playlist, voiceChannel)
    } else {
      try {
        const video = await this.youtube.getVideo(userInput)
        return this.handleVideo(msg, status, queue, video, voiceChannel)
      } catch (error) {
        try {
          const searchResult = await this.youtube.searchVideos(userInput, 1)
          const searchVideo = await this.youtube.getVideoByID(searchResult[0].id)
          return this.handleVideo(msg, status, queue, searchVideo, voiceChannel)
        } catch (error) {
          console.error(`[ERROR] ${error}`)
          return status.edit('search query returned no results, sorry!')
        }
      }
    }
  }
  async handleVideo (msg, status, queue, video, voiceChannel) {
    if (video.durationSeconds === 0) {
      status.edit(`${msg.author}, livestreams aren't supported, apologies!`)
      return null
    }
    if (!queue) {
      queue = {
        voiceChannel: voiceChannel,
        textChannel: msg.channel,
        connection: null,
        songs: []
      }
      this.queue.set(msg.guild.id, queue)

      const result = await this.addSong(video, msg, false, null)
      const resultMsg = {color: 3426654,
        description: `**Joining your voice channel:** ${queue.voiceChannel.name}
        ${result}`}

      status.edit('trying to join your voice channel, hang on.')

      try {
        const connection = await queue.voiceChannel.join()
        msg.channel.send({embed: resultMsg})
        queue.connection = connection
        this.play(msg.guild, queue.songs[0])
        status.delete()
        return null
      } catch (error) {
        msg.channel.send({embed: {color: 15158332,
          description: `**Something went wrong when joining the channel**
          Send this to an Admin: ${error}`}})
        console.error(`[ERROR] ${error}`)
      }
    } else {
      const result = await this.addSong(video, msg)
      const resultMsg = {color: 3426654,
        description: result
      }
      status.edit('', {embed: resultMsg})

      return null
    }
  }
  async handlePlaylist (msg, status, queue, playlist, voiceChannel) {
    const videos = await playlist.getVideos()
    for (const video of Object.values(videos)) {
      const video2 = await this.youtube.getVideoByID(video.id)
      if (video2.durationSeconds === 0) {
        status.edit(`${msg.author}, livestreams aren't supported, apologies!`)
        return null
      }
      if (!queue) {
        queue = {
          voiceChannel: voiceChannel,
          textChannel: msg.channel,
          connection: null,
          songs: []
        }
        this.queue.set(msg.guild.id, queue)
        await this.addSong(video2, msg)
        status.edit('trying to join your voice channel, hang on.')

        try {
          const connection = await queue.voiceChannel.join()
          queue.connection = connection
          this.play(msg.guild, queue.songs[0])
          status.delete()
        } catch (error) {
          msg.channel.send({embed: {color: 15158332,
            description: `**Something went wrong when joining the channel**
            Send this to an Admin: ${error}`}})
          console.error(`[ERROR] ${error}`)
        }
      } else {
        await this.addSong(video2, msg)
      }
    }
    const prefix = this.client.provider.get(msg.guild.id, 'prefix')

    queue.textChannel.send({ embed: {
      color: 15844367,
      title: `Added Playlist to Queue!`,
      description: `${msg.author} has queued up __${playlist.title}__ by **${playlist.channel.title}**!
      **${Object.entries(videos).length}** videos have been added to the queue.
      
      Use \`${prefix}queue\` to see all videos in the queue.`
    }})

    return null
  }

  addSong (video, msg) {
    const queue = this.queue.get(msg.guild.id)
    const song = new Song(video, msg.member)
    queue.songs.push(song)
    return `Added ${song.title} to the queue`
  }

  play (guild, song) {
    const queue = this.queue.get(guild.id)

    if (!song) {
      if (queue.textChannel) {
        queue.textChannel.send({embed: {
          color: 15844367,
          description: `No more songs in queue, leaving voice!`
        }})
      }
      queue.voiceChannel.leave()
      this.queue.delete(guild.id)
      return
    }
    queue.textChannel.send({embed: {
      color: 3447003,
      title: `Now playing: __${song.title}__`,
      description: `**Requested By:** ${song.username}
        Length: ${song.songLength}`,
      image: {url: song.thumbnail}}
    })
    let stream = ytdl(song.url, {audioonly: true})
    let streamError = false

    const dispatcher = queue.connection.playStream(stream, {passes: 3})
      .on('end', () => {
        if (streamError) return
        queue.songs.shift()
        this.play(guild, queue.songs[0])
      })
    song.dispatcher = dispatcher
    song.playing = true
  }
}