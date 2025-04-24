import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, res, next)=>{
    // read jwt docs 
    // tocken nikalo ya to cookies se ya to header se 
    try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        throw new ApiError(401, "Unauthorized Request");
    }
 
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    await User.findById(decodeToken?._id).select("-password -refreshToken");
    if(!user){
        // Todo next video
        throw new ApiError(401, "Invalid Access Token");
    }
    req.user = User;
    next();
    } catch(error){
        throw new ApiError(401, error?.message || "Invalid Access")
    }   
});