const validate = (body, requiredFields = []) => {
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

module.exports = validate;
