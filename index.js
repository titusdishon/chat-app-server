import { ApolloServer, PubSub} from "apollo-server";
import mongoose from "mongoose";
import { MONGODB } from "./config.js";
import resolvers from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/typeDefs.js";

//subscription
const pubsub= new PubSub();

const port = process.env.PORT||5000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:({req})=>({req,pubsub})
});


mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) 
  .then(() => {
    return server.listen({ port: port });
  })
  .catch((error) => {
    console.error("Error encountered", error);
  });


  //TODO: Lessong ended at 1:43 =====continue from there 