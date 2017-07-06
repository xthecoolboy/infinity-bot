const { Command } = require('discord.js-commando')
const path = require('path')
const os = require('os')
const fs = require('fs')

module.exports = class MinLengthCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'min-length',
      group: 'voice',
      memberName: 'min-length',
      aliases: ['set-ml'],
      description: 'Changes the minimum allowed length of requested songs.',
      guildOnly: true
    })
  }
  hasPermission (msg) {
    const userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => { if (err) console.error(err) }))
    for (var i in userList) if (userList[i].id === msg.author.id && userList[i].level === 3) return true
    return this.client.isOwner(msg.author)
  }
  run (msg, args) {
    if (!args) {
      const minLength = this.client.provider.get(msg.guild.id, 'minLength')
      return msg.reply(`the current minimum length is ${minLength} second(s)`)
    }
    const minLength = parseInt(args)
    if (isNaN(minLength) || minLength === 0) {
      return msg.reply(`invalid number, enter a valid option.`)
    }
    this.client.provider.set(msg.guild.id, 'minLength', minLength)

    return msg.reply(`the minimum length has been set to ${minLength} second(s)`)
  }
}
