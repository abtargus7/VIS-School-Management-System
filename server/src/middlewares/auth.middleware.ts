import { IUser, User } from "../models/user/user.model"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/AsyncHandler"
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express"

export interface IRequest extends Request {
    user?: IUser,
}

export const verifyJWT = asyncHandler( async(req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if(!token) throw new ApiError(401, "Unauthorized Request")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload

        const user = await User.findById(decodedToken._id).select("-password -accessToken")

        if(!user) throw new ApiError(401, "Invalid Access Token")

        req.user = user
        next()
        
    } catch (error) {
        throw new ApiError(401, (error as Error)?.message || "Invalid access token")
    }
})