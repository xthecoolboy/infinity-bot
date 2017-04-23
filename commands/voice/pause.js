'use strict'

const Commando = require('discord.js-commando')
const init = require('../../init.js')
const config = require('../../conf.json')
const client = init.client
var cmdPrefix = config.commandPrefix

module.exports = class PauseVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'pause-voice',
      aliases: ['pause', 'pau'],
      group: 'voice',
      memberName: 'pause-voice',
      description: 'Pauses current song',
      examples: [cmdPrefix + 'pause-voice', cmdPrefix + 'pause', cmdPrefix + 'pau'],
      guildOnly: true
    })
  }
  async run (msg) {
    const dispatcher = client.voiceConnections.first().player.dispatcher
    var botInChannel = client.voiceConnections.has(msg.channel.guild.id)
    var userMention = msg.member.user
    var userChannel = msg.member.voiceChannel
    var botChannel = client.voiceConnections.first().channel
    if (!botInChannel) {
      msg.channel.sendMessage(userMention + ', I\'m not in a voice channel\nStop picking on me :(')
    } else if (dispatcher.paused) {
      msg.channel.sendMessage(userMention + ', I\'m already paused, ya dingus!')
    } else if (userChannel === botChannel || client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR')) {
      dispatcher.pause()
      msg.channel.sendMessage(userMention + ', Paused music')
      console.log('[INFO] ' + userMention.username + '#' + userMention.discriminator + ' has paused the current stream')
    } else if (!userChannel) {
      msg.channel.sendMessage(userMention + ', you\'re not connected to a voice channel!')
    }
  }
}
