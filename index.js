const Commando = require('discord.js-commando')
const sqlite = require('sqlite')
const path = require('path')
const config = require('./conf.json')
const client = new Commando.Client({
  owner: config.ownerID,
  commandPrefix: config.commandPrefix
})

client.on('ready', () => {
  console.log(config.botName + ' ' + config.botVersion + ' ' + 'started')
})

client.registry
  .registerGroups([
    ['voice', 'Voice Commands'],
    ['misc', 'Miscellanious Commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvidor(db))
).catch(console.error)

client.on('message', message => {
  if (message.content.toUpperCase() === config.prefix + 'PING') {
    message.channel.sendMessage('Pong! ' + 'Time took: ' + Math.floor(Date.now() - message.createdTimestamp) + 'ms.')
    console.log('Sent Pong to ' + message.author.username)
  }
})

client.login(config.token)
