const Commando = require('discord.js-commando')
const init = require('../../init.js')
const config = require('../../conf.json')
const client = init.client
var cmdPrefix = config.commandPrefix

module.exports = class LeaveVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'leave-voice',
      aliases: ['lv', 'leavevoice', 'stfu'],
      group: 'voice',
      memberName: 'leave-voice',
      description: 'Leaves the voice channel the bot is in',
      examples: [cmdPrefix + 'lv', cmdPrefix + 'leavevoice', cmdPrefix + 'stfu', cmdPrefix + 'leave-voice'],
      guildOnly: true
    })
  }

  async run (msg) {
    var botInChannel = client.voiceConnections.has(msg.channel.guild.id)

    function delMsg (msg) {
      msg.channel.fetchMessage(client.user.lastMessageID)
        .then(message =>
          message.delete(1800))
        .catch(console.error)
      msg.delete(1800)
    }

    if (!botInChannel) {
      msg.reply('I\'m not connected to a voice channel!')
      setTimeout(delMsg, 200, msg)
    } else {
      const userChannel = msg.member.voiceChannel
      const botChannel = client.voiceConnections.first().channel
      if (userChannel || client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR')) {
        msg.channel.sendMessage('Leaving Voice Channel...')
        console.log(`[INFO] Leaving channel: ${botChannel.name}`)
        botChannel.connection.disconnect()
      } else if (!userChannel) {
        msg.reply('you\'re not connected to a voice channel!')
        setTimeout(delMsg, 200, msg)
      }
    }
  }
}
