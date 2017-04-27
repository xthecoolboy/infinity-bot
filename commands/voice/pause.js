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
    var botInChannel = client.voiceConnections.has(msg.channel.guild.id)
    var userMention = msg.member.user
    var userChannel = msg.member.voiceChannel

    function delMsg (msg) {
      msg.channel.fetchMessage(client.user.lastMessageID)
      .then(message =>
        message.delete(1800))
        .catch(console.error)
      msg.delete(1800)
    }

    if (!botInChannel) {
      msg.reply('I\'m not in a voice channel\nStop picking on me :(')
      setTimeout(delMsg, 200, msg)
    } else {
      const dispatcher = client.voiceConnections.first().player.dispatcher
      var botChannel = client.voiceConnections.first().channel
      if (dispatcher.paused) {
        msg.reply('I\'m already paused, ya dingus!')
        setTimeout(delMsg, 200, msg)
      } else if (userChannel === botChannel || client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR')) {
        dispatcher.pause()
        msg.channel.sendMessage('**__Music paused__**')
        console.log(`[INFO] ${userMention.username}#${userMention.discriminator} has paused the current stream`)
      } else if (!userChannel) {
        msg.reply('you\'re not connected to a voice channel!')
        setTimeout(delMsg, 200, msg)
      }
    }
  }
}
