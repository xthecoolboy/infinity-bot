const Commando = require('discord.js-commando')
const config = require('../../conf.json')
var cmdPrefix = config.commandPrefix

module.exports = class JoinVoiceCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'pingpong',
      group: 'misc',
      memberName: 'pingpong',
      description: 'Ping Pong',
      examples: [cmdPrefix + 'ping'],
      guildOnly: true
    })
  }
  async run (msg) {
    msg.channel.sendMessage('Pong! ' + 'Time took: ' + Math.floor(Date.now() - msg.createdTimestamp) + 'ms.')
    console.log('Sent Pong to ' + msg.author.username)
  }
}
