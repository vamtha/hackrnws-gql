function newLinkSubscribe(parent, args, ctx, info) {
  return ctx.db.subscription.link({
    where: { mutation_in: ['CREATED'] },
  }, info);
}

const newLink = {
  subscribe: newLinkSubscribe
}

module.exports = {
  newLink
}
