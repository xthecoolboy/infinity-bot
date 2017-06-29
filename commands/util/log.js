const Commando = require('discord.js-commando')

module.exports = class CheckVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'log',
      group: 'util',
      memberName: 'log',
      description: 'Debugging...',
      guildOnly: true
    })
  }

  hasPermission (msg) {
    return this.client.isOwner(msg.author)
  }

  async run (msg) {
    console.log(this.client.registry.types.get('member'))
  }
}
