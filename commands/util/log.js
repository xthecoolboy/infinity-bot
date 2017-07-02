const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class DebugCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'log',
      group: 'util',
      memberName: 'log',
      description: 'Debugging...',
      guildOnly: true
    })
  }

  userLevel (msg) {
    var userList = JSON.parse(fs.readFileSync('./users.json', 'utf8', (err, data) => {
      if (err) return console.error(err)
    }))
    for (var i in userList) {
      if (userList[i].name === msg.author.tag) return userList[i].level
    }
  }

  async run (msg) {
    console.log(this.userLevel(msg))
    console.log(this.userLevel(msg) < 3)
  }
}
