const supabase = require('../config/db')
const { compare } = require('../utils/hashPassword')
const { signToken } = require('../config/jwt')
const { success, fail } = require('../utils/apiResponse')

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return fail(res, 'Please enter your email and password.', 400)
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .limit(1)

  if (error) return fail(res, 'Unable to sign in right now. Please try again.', 500)
  if (!users.length) return fail(res, 'Incorrect email or password.', 401)

  const user = users[0]
  const valid = await compare(password, user.password_hash)
  if (!valid) return fail(res, 'Incorrect email or password.', 401)

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name })
  return success(res, { token, role: user.role, name: user.name })
}

module.exports = { login }