import jwt from "jsonwebtoken";
import {AuthenticationError} from "apollo-server";
import { SECRET_KEY } from "../config.js";


const CheckAuth=(context)=>{
    const authHeader=context.req.headers.authorization;
    if (authHeader) {
        //Bearer...
        const token=authHeader.split('Bearer')[1];
       
        if (token) {
          
            try{
                const user = jwt.verify(token.trim(), SECRET_KEY);
                return user;
            }
            catch{
                throw new AuthenticationError("Invalid/Expired token");
            }
        }
        throw new Error("Authentication token must be \'Bearer [token]'")
    }
    throw new Error("Authorization token must be provided")

}


export default CheckAuth;