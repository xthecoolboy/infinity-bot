const { Command } = require('discord.js-commando')
const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = class LogCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'log',
      group: 'misc',
      description: 'debugging...',
      memberName: 'log'
    })
  }
  run (msg) {
    const userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => { if (err) return console.error(err) }))
    console.log(userList[0].level)
  }
}
