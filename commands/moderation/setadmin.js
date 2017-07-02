const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class AdminChannel extends Command {
  constructor (client) {
    super(client, {
      name: 'adminchannel',
      group: 'moderation',
      memberName: 'adminchannel',
      description: 'Sets the admin channel',
      guildOnly: true,
      args: [
        {
          key: 'channel',
          prompt: ``,
          default: '',
          type: 'channel'
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
    const currentChannelID = this.client.provider.get(msg.guild.id, 'adminChannel')
    if (!args.channel) {
      if (!currentChannelID) {
        return msg.reply(`there's no channel currently set as the Administative channel.`)
          .then(m => {
            m.delete(5000)
            msg.delete(5000)
          })
      }
      const currentChannel = msg.guild.channels.find('id', currentChannelID)
      return msg.reply(`the current Administrative channel is set as ${currentChannel}`)
        .then(m => {
          m.delete(5000)
          msg.delete(5000)
        })
    }
    const newChannelID = args.channel.id
    const newChannel = args.channel
    this.client.provider.set(msg.guild.id, 'adminChannel', newChannelID)
    return msg.reply(`the new admin channel is set as ${newChannel}!`)
  }
}
