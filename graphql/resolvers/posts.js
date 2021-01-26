import postModel from "../../models/Post.js";
import CheckAuth from "../../utils/checkAuth.js";
import { AuthenticationError } from "apollo-server";

const postResolvers = {
  Query: {
    //Fetch all posts
    async getPosts() {
      try {
        const posts = await postModel.find().sort({ createdAt: -1 });
        return posts;
      } catch {
        throw new Error(err);
      }
    },
    //Get a single post
    async getPost(_, { postId }) {
      try {
        const post = await postModel.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = CheckAuth(context);
      
      if (body.trim()==='') {
         throw new Error("Post body must not be empty");
      }
      
      const newPost = new postModel({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();
      context.pubsub.publish("NEW_POST",{
        newPost:post
      });
      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = CheckAuth(context);
      console.log("Getting post to delete")
      try {
        const post = await postModel.findById(postId.trim());
        console.log("Getting post to delete", post);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed!");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Subscription:{
    newPost:{
      subscribe:(_,__, {pubsub})=>pubsub.asyncIterator("NEW_POST")
    }
  }
};

export default postResolvers;
