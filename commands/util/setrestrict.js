const { Command } = require('discord.js-commando')
const fs = require('fs')
const os = require('os')
const path = require('path')

module.exports = class SetRestrictCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setrestrict',
      group: 'util',
      memberName: 'setrestrict',
      description: 'Sets a certain role as the restricted role, automatically setting its members\' level to -1',
      guildOnly: true,
      args: [
        {
          key: 'role',
          prompt: 'Enter the role you would like to set as the restricted role.',
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
  async run (msg, args) {
    if (!args) {
      const currentRoleID = this.client.provider.get(msg.guild.id, 'restrictroleid')
      console.log(currentRoleID)
      /* const role = msg.guild.roles.get(currentRoleID)
      if (role) {
        msg.reply(`the current restricted role is set as ${role}`)
      } else {
        msg.reply(`there is no role set as the restricted role.`)
      } */
    }
    const newRoleID = args.role.id
    this.client.provider.set(msg.guild.id, 'restrictroleid', newRoleID)
    msg.reply(`the restricted role has been set to ${msg.guild.roles.find(newRoleID)}!`)
  }
}
