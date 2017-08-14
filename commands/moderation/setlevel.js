const { Command } = require('discord.js-commando')

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

  async hasPermission (msg) {
    var userLevel = await this.client.userProvider.getLevel(msg.author.id)
    return userLevel === 3 || this.client.isOwner(msg.author)
  }

  async run (msg, args) {
    const memberole = args.memberole
    const userProvider = this.client.userProvider
    const level = args.level
    var userList = await userProvider.getAllUsers()
    function findUser (user) {
      return user.id === roleUserArray[h].user.id
    }
    if (memberole.user) {
      for (var i in userList) {
        if (userList[i].userid === memberole.user.id) {
          if (typeof level === 'number') {
            if (userList[i].name !== memberole.user.tag) userProvider.setName(memberole.user.id, memberole.user.tag)
            userProvider.setLevel(memberole.user.tag, level)
            return msg.reply(`${memberole === msg.member ? 'your' : memberole} level has been set to \`${level}\``)
          }
        }
      }
      userProvider.addUser(memberole.user.id, memberole.user.tag)
      userProvider.setLevel(memberole.user.id, level)
      return msg.reply(`${memberole === msg.member ? 'your' : memberole} level has been set to \`${level}\``)
    } else {
      var roleUserArray = memberole.members.array()
      for (var g in userList) {
        for (var h in roleUserArray) {
          if (userList[g].userid === roleUserArray[h].user.id) {
            if (typeof level === 'string') {
              return msg.reply(`you must specify a level when assigning a role a level.`)
            } else {
              if (userList[g].name !== roleUserArray[h].user.tag) userProvider.setName(userList[g].userid, roleUserArray[h].user.tag)
              userProvider.setLevel(userList[g].userid, level)
            }
          }
        }
      }
      for (var j in roleUserArray) {
        if (!userList.find(findUser)) {
          userProvider.addUser(roleUserArray[j].id, roleUserArray[j].name)
          userProvider.setLevel(roleUserArray[j].id, level)
        }
      }
      return msg.reply(`members in ${memberole} have had their levels set to \`${level}\``)
    }
  }
}
