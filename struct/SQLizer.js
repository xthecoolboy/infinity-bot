module.exports = class SQLizer {
  constructor (db) {
    this.db = db
  }
  async init () {
    await this.db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, userid STRING, name STRING, commandlevel INTEGER, token STRING)')
    console.log('[INFO] User Provider initialized')
  }
  async addUser (id, name) {
    await this.db.run(`INSERT INTO users (userid, name)
    VALUES ($id, $name)`, {
      $id: id,
      $name: name
    })
  }
  async setToken (id, token) {
    await this.db.run(`UPDATE users
      SET token = $token
      WHERE userid = $id`, {
        $token: token,
        $id: id
      })
  }
  async setLevel (id, level) {
    await this.db.run(`UPDATE users
      SET commandlevel = $level
      WHERE userid = $id`, {
        $level: level,
        $id: id
      })
  }
  async setName (id, name) {
    await this.db.run(`UPDATE users
      SET name = $name
      WHERE userid = $id`, {
        $name: name,
        $id: id
      })
  }
  async getUser (id) {
    return await this.db.get(`SELECT *
      FROM users
      WHERE userid = $id`, {
        $id: id
      })
  }
  async getAllUsers () {
    return await this.db.all(`SELECT *
      FROM users`)
  }
  async getToken (id) {
    const tokenObj = await this.db.get(`SELECT token
      FROM users
      WHERE userid = $id`, {
        $id: id
      })
    if (!tokenObj) return undefined
    return tokenObj.token
  }
  async getLevel (id) {
    const levelObj = await this.db.get(`SELECT commandlevel
      FROM users
      WHERE userid = $id`, {
        $id: id
      })
    if (!levelObj) return undefined
    return levelObj.commandlevel
  }
}
