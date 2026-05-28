const success = (res, data, code = 200) => {
  return res.status(code).json({ success: true, data })
}

const fail = (res, message = 'Something went wrong', code = 400) => {
  return res.status(code).json({ success: false, message })
}

module.exports = { success, fail }