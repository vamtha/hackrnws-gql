const { GraphQLServer } = require('graphql-yoga');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuthPayload = require('./resolvers/AuthPayload');
const db = require('./db');

const resolvers = {
  Query,
  Mutation,
  AuthPayload
};

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers,
    context: req => ({ ...req, db }),
  });
}

module.exports = createServer;
