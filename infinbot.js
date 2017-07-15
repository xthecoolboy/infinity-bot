#!/usr/bin/env node

const Commando = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const path = require('path')
const os = require('os')
const fs = require('fs')
const sqlite = require('sqlite')
const config = require(path.join(os.homedir(), '/.config/infinity-bot/conf.json'))
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
  .on('unknownCommand', msg => {
    var prefix = client.provider.get(msg.guild.id, 'prefix')
    var unknownCmd = msg.content.slice(prefix.length).split(' ')
    console.log(`[WARN] ${msg.author.tag} has passed unknown command: ${unknownCmd[0]}`)
    msg.channel.send({embed: { color: 15158332,
      description: stripIndents`**__Unknown command:__ \`${unknownCmd[0]}\`**

      Message \`${prefix}help\` or \`@${client.user.tag} help\` to get a list of all available commands.`}})
  })
  .on('voiceStateUpdate', (oldMemb, newMemb) => {
    if (oldMemb.id === client.user.id && newMemb.voiceChannel) {
      const queue = client.registry.resolveCommand('voice:add').queue.get(oldMemb.guild.id)
      queue.voiceChannel = newMemb.voiceChannel
    }
  })
  .on('guildMemberUpdate', (oldMemb, newMemb) => {
    function writeUsers (userList) {
      fs.writeFile(path.join(os.homedir(), '/.config/infinity-bot/users.json'), JSON.stringify(userList), 'utf8', (err) => { if (err) console.error(err) })
    }
    if (oldMemb.roles.size !== newMemb.roles.size) {
      const userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => { if (err) console.error(err) }))
      if (newMemb.roles.size === 1) {
        for (var l in userList) if (userList[l].id === newMemb.id) userList[l].level = 0
        writeUsers(userList)
      }
      const restrictRoleID = client.provider.get(newMemb.guild.id, 'restrictroleid')
      const memberRoleID = client.provider.get(newMemb.guild.id, 'memberroleid')
      const modRoleID = client.provider.get(newMemb.guild.id, 'modroleid')
      const adminRoleID = client.provider.get(newMemb.guild.id, 'adminroleid')
      for (var [key, value] of newMemb.roles) {
        if (value.name === '@everyone') {
          continue
        }
        if (!oldMemb.roles.get(key)) {
          switch (key) {
            case restrictRoleID:
              for (var g in userList) if (userList[g].id === newMemb.id) userList[g].level = -1
              writeUsers(userList)
              break
            case memberRoleID:
              for (var h in userList) if (userList[h].id === newMemb.id) userList[h].level = 1
              writeUsers(userList)
              break
            case modRoleID:
              for (var j in userList) if (userList[j].id === newMemb.id) userList[j].level = 2
              writeUsers(userList)
              break
            case adminRoleID:
              for (var k in userList) if (userList[k].id === newMemb.id) userList[k].level = 3
              writeUsers(userList)
              break
          }
        }
      }
    }
  })

sqlite.open(path.join(os.homedir(), '/.config/infinity-bot/settings.sqlite3')).then((db) => {
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
