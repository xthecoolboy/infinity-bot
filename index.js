var Discord = require('discord.io')
var bot = new Discord.Client({
  autorun: true,
  token: 'Mjk3NDM0MDQ5NjYyOTQzMjMz.C8Aw1g.zi_jyHlhDcb8Y8zzY9LG6ZwcHcs'
})

bot.on('ready', function (event) {
  console.log('Logged in as %s - %s\n', bot.username, bot.id)
})
