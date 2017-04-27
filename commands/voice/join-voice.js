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
      aliases: ['jv',
        'joinvoice',
        'voice'],
      group: 'voice',
      memberName: 'join-voice',
      description: 'Joins the voice channel the user is in',
      examples: [cmdPrefix + 'jv',
        cmdPrefix + 'joinvoice',
        cmdPrefix + 'voice',
        cmdPrefix + 'join-voice'],
      throttling: {
        usages: 3,
        duration: 30
      },
      guildOnly: true
    })
  }

  async run (msg) {
    const userChannel = msg.member.voiceChannel
    const userMention = msg.member.user
    var botInVoice = client.voiceConnections.has(msg.channel.guild.id)

    function sendMessage (text) {
      msg.channel.sendMessage(text)
    }

    function initVoice (msg) {
      userChannel.join()
        .then(connection => {
          msg.channel.sendEmbed({ color: 3066993,
            description: `**I'm now connected to __${userChannel.name}__**\nHere are some soothing tunes.`})
          const dispatcher = connection.playFile(path.join(__dirname, 'idlemusic/') + 'Jeopardy.mp3')
          console.log(`[INFO] ${userMention.username}#${userMention.discriminator} has summoned bot to ${userChannel.name}`)
          dispatcher.once('end', () => {
            botInVoice = client.voiceConnections.has(msg.channel.guild.id)
            if (botInVoice) {
              msg.channel.sendEmbed({ color: 15158332,
                desctiption: 'Time ran out... leaving voice'})
              client.voiceConnections.first().channel.connection.disconnect()
            }
          })
        })
        .catch(console.error)
    }

    function joinVoice (msg) {
      userChannel.join()
        .then(connection => {
          const dispatcher = connection.player.dispatcher
          sendMessage(`**I've been moved to __${userChannel.name}__**\nPausing current song...`)
          dispatcher.pause()
          const botChannel = connection.channel
          console.log(`[INFO] ${userMention.username} has moved bot to ${botChannel.name}`)
        })
        .catch(console.error)
    }

    function delMsg (msg) {
      msg.channel.fetchMessage(client.user.lastMessageID)
        .then(message =>
          message.delete(1800))
        .catch(console.error)
      msg.delete(1800)
    }

    if (!botInVoice) {
      if (!userChannel) {
        msg.reply('you\'re not in a voice channel!')
        setTimeout(delMsg, 200, msg)
      } else if (!client.voiceConnections.has(msg.channel.guild.id) && userChannel) {
        initVoice(msg)
      }
    } else {
      const botChannel = client.voiceConnections.first().channel
      if (!userChannel) {
        msg.reply('you\'re not in a voice channel!')
        setTimeout(delMsg, 200, msg)
      } else if (userChannel === botChannel) {
        msg.reply('I\'m already connected to your voice channel, ya dingus!')
        setTimeout(delMsg, 200, msg)
      } else if (userChannel.members.size < botChannel.members.size - 1) {
        msg.reply('your channel has less people than the one I\'m currently in! Ask an admin to move me.')
        setTimeout(delMsg, 200, msg)
      } else if (userChannel.members.size >= botChannel.members.size - 1 && userChannel) {
        joinVoice(msg)
      }
    }
  }
}
