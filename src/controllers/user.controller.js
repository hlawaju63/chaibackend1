import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message : "ok"
    // })

    // get user details from frontend
    // validation  - not empty
    // check if username/email already exists
    // check or images, check for avatar
    // upload them to cloudinary
    // create  user object - mongodb entry
    // remove password and refreshtoken field from response
    // check if  user created
    //return res

    const { fullname, email, username, password } = req.body;
    // console.log("Req body :::: " , req.body);
    // console.log("email : ", email);

    if (
        [fullname, email, username, password].some(
            (field) => field?.trim === ""
        )
    ) {
        return new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already existed");
    }

    // console.log("req.files output :::::: ", req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;

    console.log("Avatar local path : ", avatarLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // console.log("coverImageLocalPath : " , coverImageLocalPath);

    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    console.log("cover Image path  ::: ", coverImageLocalPath);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log (" Avatar : ", avatar);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // console.log (" coverImage : ", coverImage);

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ); //check if user is created successfully

    //createdUser = createdUser().select("-password -refreshToken")

    //const createdUser = await User.findById(user._id).select("-password -refreshToken") // every . has meaning

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User Created Sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    // To Dos
    // req body -> data
    // username or email
    // find user
    // password check
    // access token and refresh token
    // send cookie

    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Inavlid User Credentials");
    }

    const  {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = user.findById(user._id)
    .select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true, 
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken)
    .cookie("refreshToken" , refreshToken)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser  , accessToken , refreshToken
            },
            "User Logged in Sucessfully"
        )
    )

});

const logoutUser  = asyncHandler(async(req , res) => {
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined,
            }
        },
        {
            new :true
        }
     )

     
    const options = {
        httpOnly : true,
        secure : true, 
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200, {} , "User logged Out")
    )
})

export { registerUser , loginUser, logoutUser };
