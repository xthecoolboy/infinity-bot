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
    var userChannel = msg.member.voiceChannel
    function joinVoice (msg) {
      userChannel.join()
        .then(connection => {
          msg.channel.sendMessage('**I\'m now connected to __' + userChannel.name + '__**\nHere are some soothing tunes.')
          const dispatcher = connection.playFile(path.join(__dirname, 'idlemusic/') + 'Jeopardy.mp3')
          dispatcher.once('end', () => {
            connection.playFile(path.join(__dirname, 'idlemusic/') + 'ambience.mp3')
            dispatcher.once('end', () => {
              msg.channel.sendMessage('Leaving Voice...')
              client.voiceConnections.first().channel.connection.disconnect()
            })
          })
          console.log('[INFO] ' + msg.member.user.username + '#' + msg.member.user.discriminator + ' has summoned bot to ' + userChannel.name)
        })
    }

    if (!userChannel) {
      msg.channel.sendMessage(msg.member.user + ', you\'re not in a voice channel!')
    } else if (!client.voiceConnections.has(msg.channel.guild.id) && userChannel) {
      joinVoice(msg)
    } else if (msg.member.voiceChannel.members.size < client.voiceConnections.first().channel.members.size - 1) {
      msg.channel.sendMessage(msg.member.user + ', your channel has less people than the one I\'m currently in! Ask an admin to move me.')
    } else if (msg.member.voiceChannel.members.size >= client.voiceConnections.first().channel.members.size - 1 && userChannel) {
      joinVoice(msg)
    }
  }
}
