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
  const where = { where: { email: args.email } };

  const user = await query.user(where, `{ id password }`);

  if(!user) throw new Error('No such User found');

  const valid = await bcrypt.compare(args.password, user.password);
  if(!valid) throw new Error('Invalid password');

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}


async function addLink(root, args, ctx, info) {
  const userId = getUserId(ctx);

  if(!userId) {
    throw new Error('You must be logged in to do that');
  }

  const link = await ctx.db.mutation.createLink({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  }, info);

  return link;
}

function updateLink(root, args, ctx, info) {
  const userId = getUserId(ctx);

  return ctx.db.mutation.updateLink({
    data: {
      url: args.url,
      description: args.description
    },
    where: {
      id: args.id,
    },
  }, info);
}

async function deleteLink(root, args, ctx, info) {
  const userId = getUserId(ctx);
  const where = { where: { id: args.id } };

  const link = await ctx.db.query.link(where, `{ id url postedBy { id } }`);
  const ownItem = link.postedBy.id === userId;

  if(!ownItem) {
    throw new Error('You dont have permission to do that!');
  }

  return ctx.db.mutation.deleteLink(where, info);
}

async function vote(root, args, ctx, info) {
  const userId = getUserId(ctx);

  const linkExist = await ctx.db.exists.Vote({
    user: { id: userId },
    link: { id: args.linkId },
  });

  if(linkExist) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return ctx.db.mutation.createVote({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: args.linkId }},
    },
  }, info);
}

module.exports = {
  signup,
  login,
  addLink,
  updateLink,
  deleteLink,
  vote
};
