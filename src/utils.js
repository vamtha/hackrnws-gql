const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET;

function getUserId(ctx) {
  const Auth = ctx.request.get('Authorization');

  if(Auth) {
    const token = Auth.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not Authenticated');
}

module.exports = {
  APP_SECRET,
  getUserId
}
