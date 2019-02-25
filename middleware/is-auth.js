const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.get('Authorization').split(' ')[1];
  console.log(token, 'token');
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'sashkatitov')
    console.log(decodedToken, 'token');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if(!decodedToken) {
    const error = new Error('Не авторизован');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
}