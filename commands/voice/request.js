const Commando = require('discord.js-commando')
const ytdl = require('ytdl-core')
const YouTube = require('simple-youtube-api')
const Song = require('../../struct/Song.js')

const init = require('../../init.js')
const client = init.client

const config = require('../../conf.json')

module.exports = class RequestCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'request',
      group: 'voice',
      memberName: 'request',
      aliases: ['req',
        'add',
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
    if (!queue) {
      voiceChannel = msg.member.voiceChannel
      if (!voiceChannel) {
        return msg.reply('join a voice channel first, ya dingus!')
      }
      const botPerms = voiceChannel.permissionsFor(client.user)
      if (!botPerms.hasPermission('CONNECT')) {
        return msg.channel.send({embed: {
          color: 15158332,
          fields: [{
            name: `Whoops...`,
            value: `I can't connect to your channel... Ask an Admin for help.`
          }]
        }})
      }
      if (!botPerms.hasPermission('SPEAK')) {
        return msg.channel.send({
          color: 15158332,
          fields: [{
            name: `Whoops...`,
            value: `I can't speak in your channel... Ask an Admin for help.`
          }]
        })
      }
    } else if (queue.voiceChannel.members.size - 1 >= msg.member.voiceChannel.members.size) {
      return msg.channel.sendEmbed({
        color: 15105570,
        fields: [{
          name: `Whoops...`,
          value: `Your channel has less people than the one I'm in... Ask an Admin to move me!`
        }]
      })
    } else if (queue.voiceChannel.members.size - 1 < msg.member.voiceChannel.members.size) {
      const botPerms = voiceChannel.permissionsFor(client.user)
      if (!botPerms.hasPermission('CONNECT')) {
        return msg.channel.sendEmbed({
          color: 15158332,
          fields: [{
            name: `Whoops...`,
            value: `I can't connect to your channel... Ask an Admin for help.`
          }]
        })
      }
      if (!botPerms.hasPermission('SPEAK')) {
        return msg.channel.sendEmbed({
          color: 15158332,
          fields: [{
            name: `Whoops...`,
            value: `I can't speak in your channel... Ask an Admin for help.`
          }]
        })
      }
    }

    const status = await msg.reply('getting video details, one moment...')
    if (userInput.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist=(.*)$/)) {
      const playlist = this.youtube.getPlaylist(userInput)
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
      status.edit(`Livestreams aren't supported, apologies!`)
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

      const result = await this.addSong(video, msg)
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
  addSong (video, msg) {
    const queue = this.queue.get(msg.guild.id)
    const song = new Song(video, msg.member)
    queue.songs.push(song)
    return `Added ${song.title} to the queue`
  }

  play (guild, song) {
    const queue = this.queue.get(guild.id)

    if (!song) {
      queue.textChannel.send({embed: {
        color: 15844367,
        description: `No more songs in queue, leaving voice!`
      }})
      queue.voiceChannel.leave()
      this.queue.delete(guild.id)
      return
    }
    queue.textChannel.send({embed: {
      color: 3447003,
      title: `Now playing: __${song.title}__`,
      description: `**Length:** ` + song.songLength,
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
