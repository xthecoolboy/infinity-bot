const Commando = require('discord.js-commando')

module.exports = class ViewQueueCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'queue',
      group: 'voice',
      memberName: 'queue',
      aliases: ['qu',
        'viewq'],
      examples: ['queue',
        'qu',
        'viewq'],
      description: `Shows what's inside queue, if one exists`,
      guildOnly: true
    })
  }
  async run (msg) {
    const queue = this.queue.get(msg.guild.id)
    const prefix = this.client.provider.get(msg.guild.id, 'prefix')
    if (!queue) {
      msg.channel.send({embed: {
        color: 10038562,
        title: `Whoops...`,
        description: `There's no queue currently! Better queue some songs up with \`${prefix}add\`!`
      }})
    } else {
      var queueList = []
      var currentSongTitle
      if (queue.songs[0].title.length > 59) {
        currentSongTitle = queue.songs[0].title.slice(0, 58)
      }
      queueList.push(`**Now Playing: __${queue.songs[0].title.length > 59 ? `${currentSongTitle}...` : queue.songs[0].title}__**
        Requested by: ${queue.songs[0].username}\n
        Up Next...`)

      for (var queuePos = 1; queuePos < queue.songs.length; queuePos++) {
        var songTitle
        if (queue.songs[queuePos].title.length > 69) {
          songTitle = queue.songs[queuePos].title.slice(0, 68)
        }
        queueList.push(`  **${queuePos}: __${queue.songs[queuePos].title.length > 69 ? `${songTitle}...` : queue.songs[queuePos].title}__**
          Requested By: ${queue.songs[queuePos].username}\n`)
        if (queuePos === 9) {
          if (queue.songs.length - 10 !== 0) queueList.push(`*And ${queue.songs.length - 10} more...*`)
          break
        }
      }

      queue.textChannel.send({embed: {
        color: 15844367,
        description: queueList.join('\n')
      }})
    }
  }

  get queue () {
    if (!this._queue) this._queue = this.client.registry.resolveCommand('voice:add').queue
    return this._queue
  }
}
