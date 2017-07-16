const { Command } = require('discord.js-commando')
const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = class SetMemberCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setmember',
      group: 'util',
      memberName: 'setmember',
      description: 'Sets a certain role as the standard member\'s role',
      guildOnly: true,
      args: [
        {
          key: 'role',
          default: '',
          prompt: 'Enter the role you would like to set as the standard member\'s role.',
          type: 'role'
        }
      ]
    })
  }
  hasPermission (msg) {
    const userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => { if (err) console.error(err) }))
    for (var i in userList) if (userList[i].id === msg.author.id && userList[i].level === 3) return true
    return this.client.isOwner(msg.author)
  }
  run (msg, args) {
    if (!args.role) {
      const currentRoleID = this.client.provider.get(msg.guild.id, 'memberroleid')
      const currentRole = msg.guild.roles.get(currentRoleID)
      if (!currentRoleID) return msg.reply(`there is no role currently set for members.`)
      return msg.reply(`the current role set for members is ${currentRole}`)
    }
    this.client.provider.set(msg.guild.id, 'memberroleid', args.role.id)
    msg.reply(`${args.role} has been set as the standard member's role.`)
    return console.log(`[INFO] ${args.role.name} has been set as member role by ${msg.author.tag}`)
  }
}
