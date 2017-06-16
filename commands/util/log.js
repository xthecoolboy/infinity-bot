const Commando = require('discord.js-commando')
const fs = require('fs')

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
    fs.readFile('./users.json', (err, data) => {
      if (err) throw err
      console.log(JSON.parse(data))
    })
  }
}
