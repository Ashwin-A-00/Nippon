const { fail } = require('../utils/apiResponse')

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return fail(res, 'Access denied', 403)
    }
    next()
  }
}

module.exports = requireRole