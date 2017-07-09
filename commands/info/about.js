const { Command } = require('discord.js-commando')
const packageInfo = require('../../package.json')
const { stripIndents } = require('common-tags')

module.exports = class AboutCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'about',
      group: 'info',
      memberName: 'about',
      description: 'Displays information about the bot'
    })
  }
  run (msg) {
    msg.channel.send({embed: {
      title: `Infinity Bot v${packageInfo.version}`,
      description: stripIndents`
      **Created by:** eodc

      Discord bot written in JS for Airstrike - Infinity's Discord server.
      [[GitHub Page]](https://github.com/eodc/infinity-bot)
      [[Testing Server]](https://discord.gg/xJssY46)
      `,
      color: 3447003
    }})
  }
}
