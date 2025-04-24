import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse} from "../utils/ApiResponse.js";


const generateAccessAndRefereshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave : false 
        });

        return { accessToken, refreshToken };

    }catch(error){
        throw new ApiError(500, "Something Went wrong");
    }
}


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


const loginUser = asyncHandler(async(req, res)=>{
    //  req body - data le ayou
    // username email he kya nahi ?
    // find the user ??
    // if user find check pass 
    // access and referesh token create  
    //  send cookie 

    const { email, username, password } = req.body;
    console.log(req.body);
    if(!email && !username){
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or : [
            {username},
            {email}
        ]
    });

    if(!user){
        throw new ApiError(404, "User Not Found");
    }

    const isPasswordValid = await user.isPasswordMatch(password);

    if(!isPasswordValid){
        throw new ApiError(404, "Invalid User Credentials");
    }

    const {accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    
    // set cookies 
    const loogedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

    const options = {
        httpOnly : true, // it makes cookie secure like only modify by server not by client side 
        secure : true,

    }

    return res.
        status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user : loogedInUser, accessToken, refreshToken
                },
                "User looged in Successfully"
            )
        )
});


const logOutUser = asyncHandler( async(req, res) =>{
    // now req. user ka accesss ka acces he humre pass
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    );
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.
    status(200).
    clearCookie("accessToken", options).
    clearCookie("refreshToken", options).
    json( new ApiResponse(200, {}, "User Logout Successfully"));
});


export { registerUser, loginUser, logOutUser };