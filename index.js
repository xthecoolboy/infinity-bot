const Commando = require('discord.js-commando')
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

client.login(config.token)
