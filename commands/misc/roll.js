const { Command } = require('discord.js-commando')

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
          key: 'dice',
          default: '6',
          prompt: '',
          type: 'integer'
        }
      ]
    })
  }
  async run (msg, args) {
    const roll = Math.floor(Math.random() * args.dice + 1)
    msg.channel.send(`${msg.member.user} rolled a ${roll}`)
  }
}
