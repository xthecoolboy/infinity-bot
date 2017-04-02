const Commando = require('discord.js-commando')
const config = require('../../conf.json')
var cmdPrefix = config.commandPrefix

module.exports = class JoinVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'join-voice',
      aliases: ['jv', 'joinvoice', 'voice'],
      group: 'voice',
      memberName: 'join-voice',
      description: 'Joins the voice channel the user is in',
      examples: [cmdPrefix + 'jv', cmdPrefix + 'joinvoice', cmdPrefix + '-voice', cmdPrefix + 'join-voice'],
      guildOnly: true
    })
  }

  async run (msg) {
    console.log(msg)
    const senderChannel = msg.member.voiceChannel
    if (senderChannel !== undefined) {
      const channel = msg.member.voiceChannel
      channel.join().then(connection => {
        console.log(msg.author.username + ' summoned bot to ' + msg.member.voiceChannel.name)
        connection.playFile('../../music/Braken - To The Stars.mp3')
        msg.channel.sendmsg('**I\'m now connected to: __' + msg.member.voiceChannel.name + '__**\nCurrently, all I can do is play Braken\'s To the Stars. You can make me leave by typing ' + config.prefix + 'lv')
        .catch(console.error)
      })
    } else if (senderChannel === undefined) {
      msg.channel.sendmsg(msg.member.user + ', you\'re not connected to a voice channel!')
    }
  }
}
