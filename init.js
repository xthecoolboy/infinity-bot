'use strict'

const Commando = require('discord.js-commando')
const path = require('path')
const {stripIndents} = require('common-tags')
const sqlite = require('sqlite')
const config = require('./conf.json')
const client = new Commando.Client({
  owner: config.ownerID,
  unknownCommandResponse: false,
  commandPrefix: '--'
})

client.on('ready', () => {
  console.log('[INFO] ' + config.botName + ' ' + config.botVersion + ' ' + 'started')
  client.user.setGame('with Schrodinger\'s cat')
})

client.on('unknownCommand', message => {
  var prefix = client.provider.get(message.guild.id, 'prefix')
  var unknownCmd = message.content.slice(prefix.length)
  console.log(`[WARN] ${message.author.tag} has passed unknown command: ${message.content}`)
  message.channel.send({embed: { color: 15158332,
    description: stripIndents`**__Unknown command:__ \`${unknownCmd}\`**

    Message \`${prefix}help\` or \`@${client.user.tag} help\` to get a list of all available commands.`}})
})

sqlite.open(path.join(__dirname, 'settings.sqlite3')).then((db) => {
  client.setProvider(new Commando.SQLiteProvider(db))
})

client.registry
  .registerGroups([
    ['voice', 'Voice Commands'],
    ['misc', 'Miscellanious Commands'],
    ['util', 'Utility Commands'],
    ['moderation', 'Moderation Commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(config.token)

process.on('unhandledRejection', err => {
  console.error('[ERROR] Uncaught Promise: \n' + err.stack)
})
