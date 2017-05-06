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
      guildOnly: true,

      examples: [cmdPrefix + 'jv',
        cmdPrefix + 'joinvoice',
        cmdPrefix + 'voice',
        cmdPrefix + 'join-voice'],

      throttling: {
        usages: 3,
        duration: 30
      }

    })
  }

  async run (msg) {
    const userChannel = msg.member.voiceChannel
    const userMention = msg.member.user
    var manualLeave = this.manualLeave
    var botInVoice = client.voiceConnections.has(msg.channel.guild.id)
    var inVoice = false

    function initVoice (msg) {
      inVoice = true
      userChannel.join()
        .then(connection => {
          msg.channel.send({embed: {
            color: 3066993,
            description: `**I'm now connected to __${userChannel.name}__**
              Here are some soothing tunes.`}})
          connection.playFile(path.join(__dirname, 'idlemusic/') + 'goat.mp3')
          console.log(`[INFO] ${userMention.username}#${userMention.discriminator} has summoned bot to ${userChannel.name}`)
        })
        .catch(console.error)
    }

    function joinVoice (msg) {
      inVoice = true
      userChannel.join()
        .then(connection => {
          const dispatcher = connection.player.dispatcher
          msg.channel.send(`**I've been moved to __${userChannel.name}__**
            Pausing current song...`)
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
    if (inVoice) {
      const voiceConnection = await client.voiceConnections.first().player.dispatchter
      console.log(voiceConnection)
      voiceConnection.once('end', () => {
        client.voiceConnections.first().channel.leave()
        inVoice = false
        if (!manualLeave) {
          msg.channel.send({embed: { color: 15158332,
            description: 'Time ran out... leaving voice'}})
        }
      })
    }
  }
  get manualLeave () {
    if (!this._manualLeave) this._manualLeave = this.client.registry.resolveCommand('voice:leave-voice').manualLeave

    return this._manualLeave
  }
}
