'use strict'

const Commando = require('discord.js-commando')
const init = require('../../init.js')
const config = require('../../conf.json')
const client = init.client
var cmdPrefix = config.commandPrefix

module.exports = class ResumeVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'play-voice',
      aliases: ['play', 'resume', 'pl'],
      group: 'voice',
      memberName: 'play-voice',
      description: 'Resumes current song',
      examples: [cmdPrefix + 'play-voice', cmdPrefix + 'play', cmdPrefix + 'resume', cmdPrefix + 'pl'],
      guildOnly: true
    })
  }
  async run (msg) {
    const dispatcher = client.voiceConnections.first().player.dispatcher
    var botInChannel = client.voiceConnections.has(msg.channel.guild.id)
    var userMention = msg.member.user
    var userChannel = msg.member.voiceChannel
    var botChannel = client.voiceConnections.first().channel
    function sendMessage (text) {
      msg.channel.sendMessage(text)
    }
    if (!botInChannel) {
      sendMessage(userMention + ', I\'m not connected to a channel!')
    } else if (!dispatcher.paused) {
      sendMessage(userMention + ', I\'m not paused right now, ya dingus!')
    } else if (userChannel === botChannel || client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR')) {
      dispatcher.resume()
      sendMessage(userMention + ', Resuming music')
      console.log('[INFO] ' + userMention.username + '#' + userMention.discriminator + ' has resumed the current stream')
    } else if (!userChannel) {
      sendMessage(userMention + ', you\'re not in a voice channel!')
    }
  }
}
