const { GraphQLServer } = require('graphql-yoga');

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
