const supabase = require('../config/db')
const { compare } = require('../utils/hashPassword')
const { signToken } = require('../config/jwt')
const { success, fail } = require('../utils/apiResponse')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return fail(res, 'Please enter your email and password.', 400)
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', String(email).trim())
      .limit(1)

    if (error) {
      console.error('Login lookup error:', error.message)
      return fail(res, 'Unable to sign in right now. Please try again.', 500)
    }

    if (!users?.length) {
      return fail(res, 'Incorrect email or password.', 401)
    }

    const user = users[0]
    if (!user.password_hash) {
      return fail(res, 'Incorrect email or password.', 401)
    }

    let valid = false
    try {
      valid = await compare(password, user.password_hash)
    } catch (compareErr) {
      console.error('Login password compare error:', compareErr.message)
      return fail(res, 'Incorrect email or password.', 401)
    }

    if (!valid) {
      return fail(res, 'Incorrect email or password.', 401)
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    })

    return success(res, { token, role: user.role, name: user.name })
  } catch (err) {
    console.error('Login error:', err)
    return fail(res, 'Unable to sign in right now. Please try again.', 500)
  }
}

module.exports = { login }
