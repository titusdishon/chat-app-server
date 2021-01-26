import postModel from "../../models/Post.js";
import { AuthenticationError, UserInputError } from "apollo-server";
import CheckAuth from "../../utils/checkAuth.js";

const likes = {
  Mutation: {
    async likePost(_, { postId }, context) {
      const { username } = CheckAuth(context);
      const post = await postModel.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          //Post already liked, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
          await post.save();
        } else {
          //Now like the post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      }else throw new UserInputError("Post not found")
    },
  },
};

export default likes;
