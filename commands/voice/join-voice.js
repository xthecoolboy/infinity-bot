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
    if (userChannel !== undefined) {
      userChannel.join()
      .then(connection => {
        console.log(msg.author.username + ' has summoned bot to ' + userChannel.name)
        msg.channel.sendMessage('**I\'m now connected to __' + userChannel.name + '__**\nAll I can currently do is play To The Stars by Braken.')
        const dispatcher = connection.playFile(path.join(__dirname, '/idlemusic/Braken - To The Stars.mp3')).on('debug', a => console.log('xxx debug', a))
        dispatcher
      })
      .catch(console.error)
    } else if (userChannel === undefined) {
      msg.channel.sendMessage(msg.member.user + ', you\'re not connected to a voice channel!')
    }
  }
}
