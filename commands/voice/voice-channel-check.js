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
      group: 'voice',
      memberName: 'bot-voice-channel',
      description: 'Checks the voice channel the bot is in',
      examples: [cmdPrefix + 'bvc'],
      guildOnly: true
    })
  }
  hasPermission (msg) {
    return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR')
  }
  async run (msg) {
    console.log(!client.voiceConnections.has(msg.channel.guild.id))
  }
}
