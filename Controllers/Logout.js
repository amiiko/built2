
const asyncHandler = require('express-async-handler');

const logout = asyncHandler(async (req, res) => {
  res.status(200).clearCookie('userToken').send('Cookie removed');
});

module.exports = {
  logout
};