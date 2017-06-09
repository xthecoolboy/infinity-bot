const Commando = require('discord.js-commando')

module.exports = class MoveAllCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'moveall',
      group: 'moderation',
      memberName: 'moveall',
      aliases: ['mvall', 'mva'],
      examples: ['moveall <departChannel> <destChannel> ', 'mvall <departChannel> <destChannel>', 'mva <departChannel> <destChannel>'],
      description: 'Moves all users in one channel into another.',
      details: 'If there are channels that are similar in name and the input is ambiguous about which to use, then the channel that comes first alphanumerically will be used.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'departChannel',
          prompt: 'Enter the name of the voice channel of whose members you want to move.',
          type: 'string'
        },
        {
          key: 'destChannel',
          prompt: 'Enter the name of the destination channel.',
          type: 'string'
        }
      ]
    })
  }
  hasPermission (msg) {
    return this.client.isOwner(msg.author) || msg.member.permissions.has('MOVE_MEMBERS')
  }
  run (msg, args) {
    const departChannel = msg.guild.channels.find(channel => channel.name.toLowerCase().includes(args.departChannel.toLowerCase()))
    const destChannel = msg.guild.channels.find(channel => channel.name.toLowerCase().includes(args.destChannel.toLowerCase()))
    if (!departChannel && !destChannel) {
      return msg.reply(`both departure and destination channels are nonexistant. Choose an existing one.`)
    }
    if (!departChannel) {
      return msg.reply(`invalid departure channel. Choose an existing voice channel.`)
    }
    if (!destChannel) {
      return msg.reply(`invalid destination channel. Choose an existing voicechannel.`)
    }
    let memberArray = departChannel.members.array()
    for (var memberPos = 0; memberPos < memberArray.length; memberPos++) {
      memberArray[memberPos].setVoiceChannel(destChannel)
    }
  }
}
