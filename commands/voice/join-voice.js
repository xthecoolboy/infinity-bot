'use strict'

const Commando = require('discord.js-commando')
const init = require('../../init.js')
const client = init.client
const config = require('../../conf.json')
const path = require('path')
var cmdPrefix = config.commandPrefix

module.exports = class JoinVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'join-voice',
      aliases: ['jv', 'joinvoice', 'voice'],
      group: 'voice',
      memberName: 'join-voice',
      description: 'Joins the voice channel the user is in',
      examples: [cmdPrefix + 'jv', cmdPrefix + 'joinvoice', cmdPrefix + 'voice', cmdPrefix + 'join-voice'],
      guildOnly: true
    })
  }

  async run (msg) {
    const userChannel = msg.member.voiceChannel
    const userMention = msg.member.user
    const botInVoice = client.voiceConnections.has(msg.channel.guild.id)
    function sendMessage (text) {
      msg.channel.sendMessage(text)
    }
    function initVoice (msg) {
      userChannel.join()
        .then(connection => {
          sendMessage('**I\'m now connected to __' + userChannel.name + '__**\nHere are some soothing tunes.')
          const dispatcher = connection.playFile(path.join(__dirname, 'idlemusic/') + 'Jeopardy.mp3')
          console.log('[INFO] ' + msg.member.user.username + '#' + msg.member.user.discriminator + ' has summoned bot to ' + userChannel.name)
          dispatcher.once('end', () => {
            sendMessage('Time run out... leaving voice')
            client.voiceConnections.first().channel.connection.disconnect()
          })
        })
    }
    function joinVoice (msg) {
      userChannel.join()
        .then(connection => {
          const dispatcher = connection.player.dispatcher
          sendMessage('**I\'ve been moved to __' + userChannel.name + '__**\nPausing current song...')
          dispatcher.pause()
          const botChannel = connection.channel
          console.log('[INFO] ' + userMention.username + ' has moved bot to ' + botChannel.name)
        })
    }
    if (!botInVoice) {
      if (!userChannel) {
        sendMessage(msg.member.user + ', you\'re not in a voice channel!')
      } else if (!client.voiceConnections.has(msg.channel.guild.id) && userChannel) {
        initVoice(msg)
      }
    } else {
      const botChannel = client.voiceConnections.first().channel
      if (userChannel === botChannel) {
        sendMessage(userMention + ', I\'m already connected to your voice channel, ya dingus!')
      } else if (userChannel.members.size < botChannel.members.size - 1) {
        sendMessage(userMention + ', your channel has less people than the one I\'m currently in! Ask an admin to move me.')
      } else if (userChannel.members.size >= botChannel.members.size - 1 && userChannel) {
        joinVoice(msg)
      }
    }
  }
}
