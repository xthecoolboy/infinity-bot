const Commando = require('discord.js-commando')
const init = require('../../init.js')
const config = require('../../conf.json')
const path = require('path')
const client = init.client
var cmdPrefix = config.commandPrefix

module.exports = class JoinVoiceCommand extends Commando.Client {
  constructor (client) {
    super(client, {
      name: 'join-voice',
      aliases: ['jv', 'voice', 'joinvoice'],
      group: 'voice',
      memberName: 'join-voice',
      throttling: {
        uses: 2,
        duration: 3
      },
      description: 'Joins the voice channel the user is in',
      examples: [cmdPrefix + 'jv', cmdPrefix + 'joinvoice', cmdPrefix + 'voice', cmdPrefix + 'join-voice'],
      guildOnly: true
    })
  }
  async run (msg) {
    var senderChannel = msg.member.voiceChannel
    var senderName = msg.member.user.username
    var senderMention = msg.member.user
    const dispatcher = null
    if(!senderChannel){
      msg.channel.sendMessage(senderMention + ', you\'re not connected to a channel!')
    } else if (client.voiceConnections.has(msg.channel.guild.id)) {
      // Find way to get dispatcher so that it can be used in another file
    } else if (senderChannel.members.size < client.voiceConnections.first().members.size - 1) {
      msg.channel.sendMessage(senderMention + ', your channel has less people than the one that I\'m currently in! \nAsk an Admin to move me!')
    } else if (senderChannel.members.size >= client.voiceConnections.first().members.size - 1) {
      // See other comment
    }

  }
}
