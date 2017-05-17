const Commando = require('discord.js-commando')

module.exports = class CheckVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'voice-channel-check',
      aliases: ['bvc'],
      group: 'util',
      memberName: 'bot-voice-channel',
      description: 'Debugging...',
      examples: ['bvc'],
      guildOnly: true
    })
  }

  async run (msg) {
    const queue = this.queue.get(msg.guild.id)
    if (this.client.isOwner(msg.author)) {
      console.log(queue.songs.length)
    }
  }
  get queue () {
    if (!this._queue) this._queue = this.client.registry.resolveCommand('voice:add').queue
    return this._queue
  }
}
