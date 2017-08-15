# Changelog
All changes to the functionality of this project will (probably) be documented here

This project (attempts to) adheres to [Semantic Versioning](semver.org)

## [2.0.4] - 2017.08.14
### Changed
- The title of the video shown in the "Now Playing" card now contains a link to said video (Thanks for the request, @0r1g1nai1ty!)
- Made the length and requested by titles display inline in the "Now Playing" card
- Added a YouTube footer in the "Now Playing" card

### Fixed
- Fix User Provider so as it does not create duplicate entries in the SQLite DB when using the `setlevel` command with a role

## [2.0.0] - 2017.08.14
### Added
- User provider which stores user data into a SQLite DB

### Deprecated
- User provider which stored user data into a JSON file

## [1.4.0] - 2017.07.22
### Added
- `feedback` command. Redirects to a Google form to report bugs and request features.

### Fixed
- Fixed a bug where 0 would not be recognized as a valid command level

## [1.3.0] - 2017.07.16
### Added
- `validatetoken` command. Cross references tokens with the user storage file, and returns if tokens are valid or not.

### Changed
- Command level changes are now mostly automated with user role changes.

## [1.2.10] - 2017.07.10
### Changed
- Unknown command message now only shows the command and none of the arguments passed

## [1.2.9] - 2017.07.08
### Added
- `about` command. Shows a link to the testing server, the current version of the bot, and a link to this repo.

## [1.2.8] - 2017.07.05
### Changed
- Location of all config and data storage files. Formerly in the root directory of the bot, now in `~/.config/infinity-bot`

## [1.2.7]
### Added
- A better way to move the bot around, using npm (Node Package Manager) instead of `git clone`

## [1.2.4] - 2017.07.04
### Changed
- Timings for `skip` command, yielding a miniscule amount of performance (25ms)

## [1.2.3] - 2017.07.04
### Added
- `skip` command, allowing users to skip video in the queue.

## [1.2.0] - 2017.07.02
### Added
- Role specific numbered permissions for commands
- `setlevel` command to set numbered permissions
- `memberole` type for arguments, deciding whether to return a role or a member
- `whois` command, giving information about a specified user
- `token` command, for voting within the Airstrike - Infinity server

## [1.1.3] - 2017.06.25
### Fixed
- Fixed a bug where bot would not leave the voice channel when using the `leavevoice` command

## [1.1.0] - 2017.06.17
### Added
- `xkcd` command, to pull comics from the website xkcd.com
- `urbandictionary` command, to pull words from urbandictionary
- `roll` command, to roll an imaginary dice
- `purge` command, to mass delete messages in case of spam

### Fixed
- Fixed a bug where bot would unexpectedly crash when leaving the voice channel

## [1.0.0] - 2017.06.12
Initial Release
