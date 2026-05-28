const supabase = require('../config/db')
const { compare } = require('../utils/hashPassword')
const { signToken } = require('../config/jwt')
const { success, fail } = require('../utils/apiResponse')

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return fail(res, 'Email and password required')

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1)

  if (error || !users.length) return fail(res, 'Invalid credentials', 401)

  const user = users[0]
  const valid = await compare(password, user.password_hash)
  if (!valid) return fail(res, 'Invalid credentials', 401)

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name })
  return success(res, { token, role: user.role, name: user.name })
}

module.exports = { login }