const Commando = require('discord.js-commando')
const init = require('../../init.js')
const config = require('../../conf.json')
const client = init.client
var cmdPrefix = config.commandPrefix

module.exports = class LeaveVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'leave-voice',
      aliases: ['lv', 'leavevoice', 'stfu'],
      group: 'voice',
      memberName: 'leave-voice',
      description: 'Leaves the voice channel the bot is in',
      examples: [cmdPrefix + 'lv', cmdPrefix + 'leavevoice', cmdPrefix + 'stfu', cmdPrefix + 'leave-voice'],
      guildOnly: true
    })
  }

  async run (msg) {
    const queue = this.queue.get(msg.guild.id)

    function delMsg (msg) {
      msg.channel.fetchMessage(client.user.lastMessageID)
        .then(message =>
          message.delete(1800))
        .catch(console.error)
      msg.delete(1800)
    }

    if (!queue.voiceChannel) {
      msg.reply('I\'m not connected to a voice channel!')
      setTimeout(delMsg, 200, msg)
    } else {
      const song = queue.songs[0]
      queue.songs = []
      console.log(`[INFO] Leaving channel: ${queue.voiceChannel.name}`)
      if (song.dispatcher) song.dispatcher.end()
      return msg.channel.send(`Y'all can blame ${msg.author} for stopping the music...`)
    }
  }
  get queue () {
    if (!this._queue) this._queue = this.client.registry.resolveCommand('voice:request').queue

    return this._queue
  }
}
