'use strict'

const Commando = require('discord.js-commando')
const path = require('path')
const config = require('./conf.json')
const client = new Commando.Client({
  owner: config.ownerID,
  commandPrefix: config.commandPrefix
})
this.client = client
client.on('ready', () => {
  console.log('[INFO] ' + config.botName + ' ' + config.botVersion + ' ' + 'started')
})

client.registry
  .registerGroups([
    ['voice', 'Voice Commands'],
    ['misc', 'Miscellanious Commands'],
    ['util', 'Utility Commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(config.token)

process.on('unhandledRejection', err => {
  console.error('[ERR] Uncaught Promise Error: \n' + err.stack)
})
