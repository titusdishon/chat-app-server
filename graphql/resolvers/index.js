import postResolvers from "./posts.js";
import userResolvers from "./users.js";
import commentResolvers from "./comments.js";
import likesResolvers from "./likes.js";

const resolvers = {
  Post:{
    likeCount:(parent)=>parent.likes.length,
    commentCount:(parent)=>parent.comments.length
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...likesResolvers.Mutation,
  },
  Subscription:{
    ...postResolvers.Subscription,
  }
};

export default resolvers;
