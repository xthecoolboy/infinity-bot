'use strict'

const Commando = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const path = require('path')
const sqlite = require('sqlite')
const config = require('./conf.json')
const packageInfo = require('./package.json')
const client = new Commando.Client({
  owner: config.ownerID,
  unknownCommandResponse: false,
  commandPrefix: '--'
})

client.on('ready', () => {
  console.log(`[INFO] Infinity Bot v${packageInfo.version} started`)
  client.user.setGame('with Schrodinger\'s cat')
})
  .on('unknownCommand', message => {
    var prefix = client.provider.get(message.guild.id, 'prefix')
    var unknownCmd = message.content.slice(prefix.length)
    console.log(`[WARN] ${message.author.tag} has passed unknown command: ${message.content}`)
    message.channel.send({embed: { color: 15158332,
      description: stripIndents`**__Unknown command:__ \`${unknownCmd}\`**

      Message \`${prefix}help\` or \`@${client.user.tag} help\` to get a list of all available commands.`}})
  })
  .on('voiceStateUpdate', (oldMemb, newMemb) => {
    if (oldMemb.id === client.user.id && newMemb.voiceChannel) {
      const queue = client.registry.resolveCommand('voice:add').queue.get(oldMemb.guild.id)
      queue.voiceChannel = newMemb.voiceChannel
    }
  })

sqlite.open(path.join(__dirname, 'settings.sqlite3')).then((db) => {
  client.setProvider(new Commando.SQLiteProvider(db))
})

client.registry
  .registerGroups([
    ['voice', 'Voice Commands'],
    ['misc', 'Miscellanious Commands'],
    ['util', 'Utility Commands'],
    ['moderation', 'Moderation Commands'],
    ['info', 'Lookup/Informational Commands']
  ])
  .registerDefaults()
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'))

process.on('unhandledRejection', err => {
  console.error('[ERROR] Uncaught Promise: \n' + err.stack)
})

client.login(config.token)
