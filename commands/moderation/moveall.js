const Commando = require('discord.js-commando')

module.exports = class MoveAllCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'moveall',
      group: 'moderation',
      memberName: 'moveall',
      aliases: ['mvall', 'mva'],
      description: 'Moves all users in one channel into another',
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
  run (msg, args) {
    const departChannel = msg.guild.channels.find(channel => channel.name.toLowerCase() === args.departChannel)
    const destChannel = msg.guild.channels.find(channel => channel.name.toLowerCase() === args.destChannel)
    var memberArray = departChannel.members.array()
    console.log(memberArray.length)
    if (departChannel && destChannel) {
      console.log('pass')
      for (var memberPos = 0; memberPos < memberArray.length; memberPos++) {
        console.log(memberArray[memberPos])
        memberArray[memberPos].setVoiceChannel(destChannel)
      }
    }
  }
}
