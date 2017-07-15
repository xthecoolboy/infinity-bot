const { Command } = require('discord.js-commando')
const path = require('path')
const os = require('os')
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
          key: 'memberole',
          label: 'member or role',
          prompt: 'Enter the member or role of whose command level you\'d like to change.',
          type: 'memberole'
        },
        {
          key: 'level',
          prompt: 'To which level would you like to set this user/role to?',
          default: '',
          type: 'integer',
          max: 3,
          min: -1
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
    const memberole = args.memberole
    const level = args.level
    var userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => { if (err) return console.error(`[ERROR] ` + err) }))
    function findUser (user) {
      return user.id === roleUserArray[h].user.id
    }
    if (memberole.user) {
      for (var i in userList) {
        if (userList[i].id === memberole.user.id) {
          if (typeof level === 'string') {
            if (userList[i].level || userList[i].level === 0) {
              if (userList[i].name !== memberole.user.tag) userList[i].name = memberole.user.tag
              fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), (err) => {
                if (err) console.err('[ERROR] ' + err)
              })
              return msg.reply(`${memberole === msg.member ? 'your' : memberole + `'s`} current command level is \`${userList[i].level}\``)
            } else if (userList[i].level === undefined) return msg.reply(`there is no level currently set for ${memberole === msg.member ? 'you' : memberole}`)
          } else if (typeof level === 'number') {
            if (userList[i].name !== memberole.user.tag) userList[i].name = memberole.user.tag
            userList[i].level = level
            fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), (err) => {
              if (err) console.err('[ERROR] ' + err)
            })
            return msg.reply(`${memberole === msg.member ? 'your' : memberole} level has been set to \`${level}\``)
          }
        }
      }
      const userInfo = {id: memberole.user.id, name: memberole.user.tag, level: level}
      userList.push(userInfo)
      fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), (err) => {
        if (err) console.err('[ERROR] ' + err)
      })
      return msg.reply(`${memberole === msg.member ? 'your' : memberole} level has been set to \`${level}\``)
    } else {
      var roleUserArray = memberole.members.array()
      for (var g in userList) {
        for (var h in roleUserArray) {
          if (userList[g].id === roleUserArray[h].user.id) {
            if (typeof level === 'string') {
              return msg.reply(`you must specify a level when assigning a role a level.`)
            } else {
              if (userList[g].name !== roleUserArray[h].user.tag) userList[g].name = roleUserArray[g].user.tag
              userList[g].level = level
              fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), (err) => {
                if (err) console.err('[ERROR] ' + err)
              })
            }
          }
        }
      }
      for (var j in roleUserArray) {
        if (!userList.find(findUser)) {
          const userInfo = {id: roleUserArray[j].user.id, name: roleUserArray[j].user.tag, level: level}
          userList.push(userInfo)
          fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), (err) => {
            if (err) console.err('[ERROR] ' + err)
          })
        }
      }
      return msg.reply(`members in ${memberole} have had their levels set to \`${level}\``)
    }
  }
}
