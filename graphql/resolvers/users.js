import userModel from "../../models/User.js";
import bcyrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config.js";
import { UserInputError } from "apollo-server";
import {
  validateRegistrationInputs,
  validateLoginInput,
} from "../../utils/validators.js";

function generateToken(user) {
    return jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
}

const userResolvers = {
  Mutation: {
    async login(_, { username, password }) {
        //Validate incoming login request credentials
        const{valid, errors}=validateLoginInput( username, password );
        if (!valid) {
            throw new UserInputError("errors", {errors})
        }
        const user= await userModel.findOne({username});
        if (!user) {
            errors.general="User not found!";
            throw  new UserInputError('User not found', {errors});
        };
        const match = await bcyrypt.compare(password, user.password);
        if (!match) {
            errors.general ="Wrong login credentials";
            throw new UserInputError("Wrong login credentials", {errors});
        
        }
        const token=generateToken(user);
        return {
            ...user._doc,
            id: user._id,
            token,
          };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      //Validate user data
         const{valid, errors}=validateRegistrationInputs(  username,
        email,
        password,
        confirmPassword);
      if (!valid) {
          throw new UserInputError("errors", {errors})
      }
      //Make sure user does not already exist
      const user = await userModel.findOne({ username });

      if (user) {
        throw new UserInputError("Usename is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      //Hash password and create auth token
      password = await bcyrypt.hash(password, 12);
      const newUser = new userModel({
        email,
        username,
        password,
        createdAt: new Date().toDateString(),
      });
      const res = await newUser.save(); 
      const token = generateToken(res)
      return {
        ...res._doc, id: res._id,token,
      };
    },
  },
};

export default userResolvers;
