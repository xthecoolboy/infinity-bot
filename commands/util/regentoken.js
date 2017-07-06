const { Command } = require('discord.js-commando')
const path = require('path')
const os = require('os')
const fs = require('fs')
const randomstr = require('randomstring')

module.exports = class RegenTokensCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'regentoken',
      group: 'util',
      memberName: 'regentoken',
      description: 'Regenerates the user\'s token, if they think it has been compromised.',
      guildOnly: true
    })
  }
  hasPermission (msg) {
    const userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/botconfigs/users.json'), 'utf8', (err, data) => { if (err) console.error(err) }))
    for (var i in userList) if (userList[i].id === msg.author.id && userList[i].level >= 1) return true
    return this.client.isOwner(msg.author)
  }
  async run (msg, args) {
    const dmChannel = await msg.member.createDM()
    var userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/botconfigs/users.json'), 'utf8', (err, data) => { if (err) console.error(err) }))
    function userHasPerm (msg) {
      for (var i in userList) {
        if (userList[i].id === msg.author.id && userList[i].level >= 3) return true
      }
      return this.client.isOwner
    }
    if (args.toLowerCase() === 'all' && userHasPerm(msg)) {
      for (var i in userList) {
        userList[i].token = randomstr.generate(12)
      }
      fs.writeFile(path.join(os.homedir(), '/botconfigs/users.json'), JSON.stringify(userList), (err) => {
        if (err) console.err('[ERROR] ' + err)
      })
      msg.reply('all tokens have been regenerated!').then(m => {
        m.delete(5000)
        msg.delete(5000)
      })
    } else {
      for (var g in userList) {
        if (userList[g].id === msg.author.id) {
          userList[g].token = randomstr.generate(12)
          fs.writeFile(path.join(os.homedir(), '/botconfigs/users.json'), JSON.stringify(userList), (err) => {
            if (err) console.err('[ERROR] ' + err)
          })
          dmChannel.send(`Your new token is \`${userList[g].token}\`. Be careful next time!`)
        }
      }
    }
  }
}
