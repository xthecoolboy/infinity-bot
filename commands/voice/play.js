'use strict'

const Commando = require('discord.js-commando')

module.exports = class ResumeCommand extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'play',
      aliases: ['play-voice', 'resume', 'pl'],
      group: 'voice',
      memberName: 'play',
      description: 'Resumes current song',
      examples: ['play-voice', 'play', 'resume', 'pl'],
      guildOnly: true
    })
  }
  async run (msg) {
    const queue = this.queue.get(msg.guild.id)
    var userChannel = msg.member.voiceChannel
    let response
    if (!queue) {
      response = await msg.reply('I\'m not connected to a channel!')
      this.delMsg(msg, response)
    } else {
      const song = queue.songs[0]
      if (song.playing) {
        response = await msg.reply('I\'m not paused right now, ya dingus!')
        this.delMsg(msg, response)
      } else if (userChannel === queue.voiceChannel || this.client.isOwner(msg.author) || msg.member.permissions.has('ADMINISTRATOR')) {
        song.dispatcher.resume()
        song.playing = true
        msg.channel.send('**Music Resumed**')
        console.log(`[INFO] ${msg.author.tag} has resumed the current stream`)
      } else if (!userChannel) {
        response = await msg.reply('you\'re not in a voice channel!')
        this.delMsg(msg, response)
      } else if (userChannel !== queue.voiceChannel) {
        response = await msg.reply(`you're not in my voice channel. Join it before resuming.`)
      }
    }
  }
  delMsg (msg, response) {
    response.delete(2000)
    msg.delete(2000)
  }
  get queue () {
    if (!this._queue) this._queue = this.client.registry.resolveCommand('voice:add').queue
    return this._queue
  }
}
