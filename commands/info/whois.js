const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const fs = require('fs')

module.exports = class WhoIsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'whois',
      group: 'info',
      memberName: 'whois',
      description: 'Looks up info on a specified user.',
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Which user would you like to lookup?',
          type: 'member'
        }
      ]
    })
  }
  getToken (msg, member) {
    const userList = JSON.parse(fs.readFileSync('./users.json', 'utf8', (err, data) => { if (err) return console.error(err) }))
    for (var i in userList) {
      if (userList[i].id === member.user.id && userList[i].token) {
        return userList[i].token
      } else if (!userList[i].token) {
        return '(none)'
      }
    }
  }
  getLevel (msg, member) {
    const userList = JSON.parse(fs.readFileSync('./users.json', 'utf8', (err, data) => { if (err) return console.error(err) }))
    for (var i in userList) {
      if (userList[i].id === member.user.id && userList[i].level) {
        return userList[i].level
      } else if (!userList[i].level) {
        return '(none)'
      }
    }
  }
  run (msg, args) {
    const member = args.user
    const adminChannelID = this.client.provider.get(msg.guild.id, 'adminChannel')
    return msg.channel.send({embed: {
      color: 3447003,
      description: `${member.user.username === member.displayName ? member.user.tag : member.user.tag + ` (${member.displayName})`}`,
      fields: [
        {
          name: '» User Details:',
          value: stripIndents`
          ‣ ID: \`${member.id}\`
          ‣ Joined Discord: \`${member.user.createdAt}\`
          ‣ Bot User: \`${member.user.bot}\`
          ‣ Status: \`${member.user.presence.status.charAt(0).toUpperCase() + member.user.presence.status.slice(1)}\`
          ‣ Currently Playing: ${member.user.presence.game ? member.user.presence.game.name : '`Nothing`'}`
        },
        {
          name: '» Server Member Details:',
          value: stripIndents`
          ‣ Role(s): ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}
          ‣ Joined on:  \`${member.joinedAt}\`${member.nickname ? `\n‣ Nickname: \`${member.nickname}\`` : ''}
          ‣ Command Level: \`${this.getLevel(msg, member)}\`
          ${msg.channel.id === adminChannelID ? `‣ Token: \`${this.getToken(msg, member)}\`` : ''}
          `
        }
      ]
    }})
  }
}
