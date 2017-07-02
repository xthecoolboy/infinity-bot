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
    const userList = JSON.parse(fs.readFileSync('./users.json', 'utf8', (err, data) => { if (err) console.error(err) }))
    for (var i in userList) if (userList[i].name === msg.author.tag && userList[i].level === 3) return true
    return this.client.isOwner(msg.author)
  }
  run (msg, args) {
    const memberole = args.memberole
    const level = args.level
    if (memberole.user) {
      fs.readFile('./users.json', 'utf8', (err, data) => {
        if (err) return console.error(`[ERROR] ` + err)
        var userList = JSON.parse(data)
        for (var i in userList) {
          if (userList[i].name === memberole.user.tag) {
            if (userList[i].level && !level) {
              return msg.reply(`${memberole === msg.member ? 'your' : memberole + `'s`} current command level is \`${userList[i].level}\``)
            } else if (!userList[i].level && !level) {
              return msg.reply(`there is no level currently set for ${memberole === msg.member ? 'you' : memberole}`)
            } else if (level) {
              userList[i].level = level
              fs.writeFile('./users.json', JSON.stringify(userList), (err) => {
                if (err) console.err('[ERROR] ' + err)
              })
              return msg.reply(`${memberole === msg.member ? 'your' : memberole} level has been set to \`${level}\``)
            }
          }
        }
        const userInfo = {name: memberole.user.tag, level: level}
        userList.push(userInfo)
        fs.writeFile('./users.json', JSON.stringify(userList), (err) => {
          if (err) console.err('[ERROR] ' + err)
        })
        return msg.reply(`${memberole === msg.member ? 'your' : memberole} level has been set to \`${level}\``)
      })
    } else {
      fs.readFile('./users.json', 'utf8', (err, data) => {
        if (err) return console.error(`[ERROR] ` + err)
        var userList = JSON.parse(data)
        var roleUserArray = memberole.members.array()
        for (var i in userList) {
          for (var g in roleUserArray) {
            if (userList[i].name === roleUserArray[g].user.tag) {
              if (!level) {
                return msg.reply(`you must specify a level when assigning a role a level.`)
              } else {
                userList[i].level = level
                fs.writeFile('./users.json', JSON.stringify(userList), (err) => {
                  if (err) console.err('[ERROR] ' + err)
                })
                return msg.reply(`Members in ${memberole} have had their levels set to \`${level}\``)
              }
            }
          }
        }
      })
    }
  }
}
