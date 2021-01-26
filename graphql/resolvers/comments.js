import postModel from "../../models/Post.js";
import { AuthenticationError, UserInputError } from "apollo-server";
import CheckAuth from "../../utils/checkAuth.js";

const comments ={
    Mutation: {
      createComment: async (_, { postId, body }, context) => {
        const {username} = CheckAuth(context);
       
        if (body.trim === "") {
          throw new UserInputError("Empty comment", {
            errors: {
              body: "comment body must not be empty",
            },
          });
        }
        const post = await postModel.findById(postId.trim());
        console.log("User ", post)
        if (post) {
          post.comments.unshift({
            body,
            username,
            createdAt: new Date().toISOString(),
          });
          await post.save();
          return post;
        }else throw new UserInputError("Post not found")
      },
      async deleteComment(_, {postId, commentId}, context){
        const {username}=CheckAuth(context);
        const post = await postModel.findById(postId);
        if (post) {
             const commentIndex = post.comments.findIndex(c=>c.id===commentId);
              if (post.comments[commentIndex].username===username) {
                post.comments.splice(commentIndex, 1);
                await post.save();
                return post;
              }else{
                throw new AuthenticationError("Action not allowed")
              }
        }else{
          throw new UserInputError("Post not found")
        }
      }
    }
    
  };

export default comments;
