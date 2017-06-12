const { Command } = require('discord.js-commando')

module.exports = class PurgeMessageCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'purge',
      group: 'moderation',
      memberName: 'purge',
      examples: ['purge 50'],
      description: 'Deletes a set number of messages from channel.',
      details: 'Deletes user specified number of messages from the channel the purge command was sent in.',
      guildOnly: true,
      args: [
        {
          key: 'input',
          prompt: 'Enter the number of messages you would like to delete (not including the command message).',
          type: 'integer'
        }
      ]
    })
  }
  hasPermission (msg) {
    return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES')
  }
  run (msg, args) {
    const input = args.input
    msg.channel.bulkDelete(input)
    msg.reply(`deleted ${input} message(s)!`).then(m => {
      m.delete(10000)
      msg.delete(10000)
    })
  }
}
