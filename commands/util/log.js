const Commando = require('discord.js-commando')

module.exports = class DebugCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'log',
      group: 'util',
      memberName: 'log',
      description: 'Debugging...',
      guildOnly: true
    })
  }

  hasPermission (msg) {
    return this.client.isOwner(msg.author)
  }

  async run (msg) {
    const queue = this.queue
    console.log(queue)
  }
  get queue () {
    if (!this._queue) this._queue = this.client.registry.resolveCommand('voice:add').queue
    return this._queue
  }
}
