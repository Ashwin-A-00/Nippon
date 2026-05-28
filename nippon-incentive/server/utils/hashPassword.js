const bcrypt = require('bcryptjs')

const hash = async (password) => {
  return await bcrypt.hash(password, 10)
}

const compare = async (password, hashed) => {
  return await bcrypt.compare(password, hashed)
}

module.exports = { hash, compare }