# Infinity Bot™
[![npm](https://img.shields.io/npm/v/infinity-bot.svg?style=flat-square)](https://www.npmjs.com/package/infinity-bot)
[![David](https://img.shields.io/david/eodc/infinity-bot.svg?style=flat-square)](https://david-dm.org/eodc/infinity-bot)
[![Discord](https://img.shields.io/discord/297931537008295941.svg?style=flat-square)](https://discord.gg/mvg97G3)

Bot used for Airstrike-Infinity's Discord server. Written in JS.

# Installation
(Requires current version of node.js, not LTS version.)

`npm install infinity-bot`

Wherever the module is installed (should be at `~/node_modules`), modify the file `discord.js-commando/src/commands/message.js` at line 134, replacing `if(!this.command.hasPermission(this)) {` with `if(!(await this.command.hasPermission(this))) {`

## Initial Configuration

1. Create a bot account and token. Instructions may be found [here](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)

2. Get your own user id by following the instructions [here](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)

3. Get a YouTube API key by following the instructions [here](https://developers.google.com/youtube/v3/getting-started)

4. Create `~/.config/infinity-bot/conf.json`

5. Copy this format in the config file:
```json
{
  "token": "<Your bot token>",
  "ownerID": "<Your UserID>",
  "googleAPIKey": "<Your YouTube API Key>"
}
```
6. While in `~`, run `./node_modules/.bin/infinity-bot`
7. Use the `help` command and test out the numerous utility and moderation commands.

## Troubleshooting
### HELP! THERE'S NO SOUND WHEN PLAYING MUSIC YTF IS UR BOT SHIT?
Did you set the default volume by using the `defaultvolume` command?


# Licence
    Infinity Bot - Bot utilizing NodeJS & Discord API
    Copyright (C) 2018  Nicholas Nhien

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
