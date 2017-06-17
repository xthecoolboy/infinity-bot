const { Command } = require('discord.js-commando')
const { stripIndents } = require('discord.js-commando')

module.exports = class RollCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'roll',
      group: 'misc',
      memberName: 'roll',
      description: 'Roll an imaginary die (d6 is the default)',
      examples: [
        'roll',
        'roll 10',
        'roll 20'
      ],
      args: [
        {
          key: 'size',
          default: '6',
          prompt: '',
          type: 'integer'
        }
      ]
    })
  }
  async run (msg, args) {
    const die = args.size
    const roll = Math.floor(Math.random() * die + 1)
    msg.channel.send(`${msg.member.user} rolled a ${roll}`)
  }
}
