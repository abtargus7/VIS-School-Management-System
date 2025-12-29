import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User, IUser } from "../models/user/user.model";
import { Request, Response } from "express";

const getAccessToken = async (userId: string) => {
    try {
        const user = await User.findById(userId) as IUser | null;

        if(!user) throw new ApiError(404, "User not found")

        const accessToken = user.generateAccessToken()

        user.accessToken = accessToken

        await user.save({validateBeforeSave: false})

        return accessToken

    } catch (error) {
        throw new ApiError(401, "Unable to generate accessToken")
    }
}

// create new user
const registerUser = asyncHandler( async(req: Request, res: Response) => {
    const {firstName, lastName, email, password, role } = req.body

    if(
        [firstName, lastName, email, password].some((field) => 
        field?.trim() === "") 
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        email : email
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = new User({
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email,   
        role: role
    })

    const isCreated = await user.save()
    console.log(isCreated)

    const createdUser = await User.findById(isCreated._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

// login user 
const loginUser = asyncHandler( async(req: Request, res: Response) => {
    const {email, password} = req.body

    if(!email) {
        throw new ApiError(400, "Username or password is required!")
    }

    const user = await User.findOne({email}) as IUser | null

    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const accessToken = await getAccessToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -accessToken")
    
    const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200,
        {
            user: loggedInUser, accessToken
        }
    ))
})

const testError = asyncHandler( async( req: Request, res: Response) => {
    throw new ApiError(404, "Test")
})

export { registerUser, loginUser, testError }