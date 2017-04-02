const Discord = require('discord.js')
const config = require('./conf.json')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(config.botName + ' ' + config.botVersion + ' ' + 'started')
})

client.on('message', message => {
  if (message.content.toUpperCase() === config.prefix + 'PING') {
    message.channel.sendMessage('Pong! ' + 'Time took: ' + Math.floor(Date.now() - message.createdTimestamp) + 'ms.')
    console.log('Sent Pong to ' + message.author.username)
  }
})
client.on('message', message => {
  if (message.content.toUpperCase() === config.prefix + 'JV') {
    const senderChannel = message.member.voiceChannel
    if (senderChannel !== undefined) {
      const channel = message.member.voiceChannel
      channel.join().then(connection => {
        console.log(message.author.username + ' summoned bot to ' + message.member.voiceChannel.name)
        connection.playFile('./music/Braken - To The Stars.mp3')
        message.channel.sendMessage('**I\'m now connected to: __' + message.member.voiceChannel.name + '__**\nCurrently, all I can do is play Braken\'s To the Stars. You can make me leave by typing ' + config.prefix + 'lv')
      .catch(console.error)
      })
    }
    else if (senderChannel === undefined) {
      message.channel.sendMessage(message.member.user + ', you\'re not connected to a voice channel!')
    }
  }
})
client.on('message', message => {
  if (message.content.toUpperCase() === config.prefix + 'LV') {
    const senderChannel = message.member.voiceChannel
    const botVoiceChannel = client.voiceConnections.first().channel
    if (senderChannel !== undefined && senderChannel === botVoiceChannel) {
      const channel = message.member.voiceChannel.connection
      channel.disconnect()
      console.log('Leaving voice...')
    }
    else if (senderChannel === undefined) {
      message.channel.sendMessage(message.member.user + ', you\'re not connected to a voice channel!')
    }
    else if (senderChannel !== botVoiceChannel) {
      message.channel.sendMessage(message.member.user + ', you\'re not in the same channel as me!')
    }
  }
})

client.login(config.token)
