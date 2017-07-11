const { Command } = require('discord.js-commando')
const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = class SetAdminRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setadminrole',
      group: 'util',
      memberName: 'setadminrole',
      description: 'Sets a certain role as the Admin role',
      guildOnly: true,
      args: [
        {
          key: 'role',
          default: '',
          prompt: 'Enter the role you would like to set as the Admin role.',
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
      const currentRoleID = this.client.provider.get(msg.guild.id, 'adminroleid')
      const currentRole = msg.guild.roles.get(currentRoleID)
      if (!currentRoleID) return msg.reply(`there is no Admin role currently set.`)
      return msg.reply(`the current Admin role is ${currentRole}`)
    }
    this.client.provider.set(msg.guild.id, 'adminroleid', args.role.id)
    msg.reply(`${args.role} has been set as the Admin role.`)
    return console.log(`[INFO] ${args.role.name} has been set as Admin role by ${msg.author.tag}`)
  }
}
