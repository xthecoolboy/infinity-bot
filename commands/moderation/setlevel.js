const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class SetLevelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setlevel',
      group: 'moderation',
      memberName: 'setlevel',
      description: 'Sets all users in a role or a specific user\'s level of command ability',
      guildOnly: true,
      args: [
        {
          key: 'member',
          prompt: '',
          default: '',
          type: 'member'
        },
        {
          key: 'role',
          prompt: '',
          default: '',
          type: 'role'
        },
        {
          key: 'level',
          prompt: 'What level would you like to be assigned?',
          type: 'integer'
        }
      ]
    })
  }
  hasPermission (msg) {
    return this.client.isOwner(msg.author) || fs.readFile('./users.json', (err, data) => {
      if (err) console.error(err)
      var userList = JSON.parse(data)
      for (var i in userList) {
        if (userList[i].name === msg.member.tag && userList[i].level === 3) return true
      }
      return false
    })
  }
  run (msg, args) {
    if (!args.member && !args.role) return msg.reply('you must specify a member or role you would like to modify!')
    if (args.member && args.role) return msg.reply('you can only specify one role or one member to modify!')
    if (!args.member) {
      const role = args.role
      fs.readFile('./users.json', (err, data) => {
        if (err) return console.error('[ERROR] ' + err)
        var usersList = JSON.parse(data)
        var roleUserList = role.members.array()
        console.log(roleUserList)
      })
    }
  }
}
