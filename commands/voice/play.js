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

    function delMsg (msg) {
      msg.channel.fetchMessage(client.user.lastMessageID)
        .then(message =>
          message.delete(1800))
        .catch(console.error)
      msg.delete(1800)
    }

    if (!botInChannel) {
      msg.reply(', I\'m not connected to a channel!')
      setTimeout(delMsg, 200, msg)
    } else if (!dispatcher.paused) {
      msg.reply(', I\'m not paused right now, ya dingus!')
      setTimeout(delMsg, 200, msg)
    } else if (userChannel === botChannel || client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR')) {
      dispatcher.resume()
      msg.reply(', resuming music')
      console.log('[INFO] ' + userMention.username + '#' + userMention.discriminator + ' has resumed the current stream')
    } else if (!userChannel) {
      msg.reply(', you\'re not in a voice channel!')
      setTimeout(delMsg, 200, msg)
    }
  }
}
