'use strict'

const Commando = require('discord.js-commando')
const path = require('path')
const sqlite = require('sqlite')
const config = require('./conf.json')
const client = new Commando.Client({
  owner: config.ownerID,
  unknownCommandResponse: false,
  commandPrefix: config.commandPrefix
})
this.client = client
client.on('ready', () => {
  console.log('[INFO] ' + config.botName + ' ' + config.botVersion + ' ' + 'started')
  client.user.setGame('with Schrodinger\'s cat')
})

client.on('unknownCommand', message => {
  console.log(`[WARN] ${message.author.username}#${message.author.discriminator} has passed unknown command: ${message.content}`)
  message.channel.sendEmbed({ color: 15158332,
    description: `**__Unknown command: \`${message.content}\`__**\n\nMessage \`${config.commandPrefix}help\` or \`@${client.user.username}#${client.user.discriminator} help\` to get a list of all available commands.`})
})

client.registry
  .registerGroups([
    ['voice', 'Voice Commands'],
    ['misc', 'Miscellanious Commands'],
    ['util', 'Utility Commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error)

client.login(config.token)

process.on('unhandledRejection', err => {
  console.error('[ERROR] Uncaught Promise: \n' + err.stack)
})
