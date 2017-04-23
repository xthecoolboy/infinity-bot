const Commando = require('discord.js-commando')
const init = require('../../init.js')
const client = init.client
const config = require('../../conf.json')
var cmdPrefix = config.commandPrefix

module.exports = class CheckVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'voice-channel-check',
      aliases: ['bvc'],
      group: 'util',
      memberName: 'bot-voice-channel',
      description: 'Debugging...',
      examples: [cmdPrefix + 'bvc'],
      guildOnly: true
    })
  }

  async run (msg) {
    if (client.isOwner(msg.author)) {
      console.log(client.voiceConnections)
    }
  }
}
