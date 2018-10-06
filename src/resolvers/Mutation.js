const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, ctx, info) {
  const { mutation } = ctx.db;

  const password = await bcrypt.hash(args.password, 10);
  const data = { ...args, password };

  const user = await mutation.createUser({ data }, `{ id }`);
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

async function login(parent, args, ctx, info) {
  const { query } = ctx.db;

  const user = await query.user({ where: { email: args.email }}, `{ id password }`);

  if(!user) throw new Error('No such User found');

  const valid = await bcrypt.compare(args.password, user.password);
  if(!valid) throw new Error('Invalid password');

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}


function addLink(root, args, ctx, info) {
  const userId = getUserId(ctx);
  return ctx.db.mutation.createLink({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  }, info);
}

function updateLink() {
  return 'update a link';
}

function deleteLink() {
  return 'delete a link';
}

module.exports = {
  signup,
  login,
  addLink,
  updateLink,
  deleteLink
};
