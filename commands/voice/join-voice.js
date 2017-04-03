const Commando = require('discord.js-commando')
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
    if (userChannel) {
      userChannel.join().then(connection => {
        msg.channel.sendMessage('**I\'m now connected to __' + userChannel.name + '__**\nAll I can do currently is play Hotel California')
        connection.playFile(path.join(__dirname, 'idlemusic/') + 'Eagles - Hotel California.mp3')
      })
    } else if (!userChannel) {
      msg.channel.sendMessage(msg.member.user + ', you\'re not in a voice channel!')
    }
  }
}
