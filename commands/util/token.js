const { Command } = require('discord.js-commando')
const path = require('path')
const os = require('os')
const fs = require('fs')
const randomstr = require('randomstring')

module.exports = class TokenCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'token',
      group: 'util',
      memberName: 'token',
      description: `PM's the user their unique token`,
      guildOnly: true
    })
  }
  hasPermission (msg) {
    const userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => { if (err) console.error(err) }))
    for (var i in userList) if (userList[i].id === msg.author.id && userList[i].level >= 1) return true
    return this.client.isOwner(msg.author)
  }
  async run (msg) {
    const dmChannel = await msg.member.createDM()
    fs.readFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => {
      if (err) console.error(err)
      var userList = JSON.parse(data)
      for (var i in userList) {
        if (userList[i].id === msg.member.id) {
          if (userList[i].token) {
            if (userList[i].name !== msg.member.user.tag) userList[i].name = msg.member.user.tag
            fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), (err) => {
              if (err) console.err('[ERROR] ' + err)
            })
            dmChannel.send(`${msg.member.user}, your unique token is \`${userList[i].token}\`. Don't share this with anyone!`)
            return null
          } else {
            if (userList[i].name !== msg.member.user.tag) userList[i].name = msg.member.user.tag
            userList[i].token = randomstr.generate(12)
            fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), (err) => {
              if (err) console.err('[ERROR] ' + err)
            })
            dmChannel.send(`${msg.member.user}, your unique token is \`${userList[i].token}\`. Don't share this with anyone!`)
            return null
          }
        }
      }
      const userInfo = {id: msg.member.id, name: msg.member.user.tag, token: randomstr.generate(12)}
      userList.push(userInfo)
      fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), (err) => {
        if (err) console.err('[ERROR] ' + err)
      })
      dmChannel.send(`${msg.member.user}, your unique token is \`${userInfo.token}\`. Don't share this with anyone!`)
    })
  }
}
