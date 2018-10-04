function apiInfo() {
  return `This is the API of a Hackernews Clone`;
}

function feed(parent, args, ctx, info) {
  return ctx.db.query.links({}, info);
}


module.exports = {
  apiInfo,
  feed
}
