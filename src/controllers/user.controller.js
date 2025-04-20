import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse} from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // register user
    // 1. get user details from frontend 
    // 2. validation - not empty
    // 3. check if user already exist : usernmae, email 
    // 4. check for images, check for avatar
    // 5. upload them to cloudinary 
    // 6 create user object - create entry in db
    // 7 remove password and refresh token field from response
    // check for user creation 
    // return res
    
    const {fullName, email, username, password} = req.body;

   
     // check data is not empty
    if(
        // some return true if any of the item is empty
        [fullName, email, username, password].some(item => 
            item?.trim() === ""
        
        )
    ){
        throw new ApiError(400, "Please fill all the fields")
    }

    // check if user already exist
    const existedUser = await User.findOne({ $or: [{username}, {email}]});

    if(existedUser){
        throw new ApiError(409, "User already exist")
    }

    // check images and handle images 
    // multer gives us req.files
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath;
    // files ayi? array aya ? (isArray), lenght > 0 (properties he kya nahi usme )
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.lenght > 0){
        coverImageLocalPath = req.files.coverImage[0].path; 
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    // upload to cloudinary
    const avatar =  await uploadOnCloudinary(avatarLocalPath);
    const coverImage =  await uploadOnCloudinary(coverImageLocalPath);
    
    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })
    // kya kya nahi chahiye
    const createdUser = await User.findById(user._id).select("-password -refreshToken");


    if(!createdUser){
        throw new ApiError(500, "Something went wrong While regestering user")
    };

    // send response ( structured data)
    return res.status(201).json(new ApiResponse(200, createdUser, "User Registered successfully"));

});


export { registerUser };