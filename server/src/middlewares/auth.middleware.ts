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
        // Try to get token from cookies first
        let token = req.cookies?.accessToken

        // If not in cookies, try Authorization header (case-insensitive)
        if(!token) {
            const authHeader = req.header("Authorization") || req.header("authorization")
            if(authHeader) {
                // Handle both "Bearer token" and just "token" formats
                token = authHeader.startsWith("Bearer ") 
                    ? authHeader.substring(7).trim() 
                    : authHeader.trim()
            }
        }

        if(!token) {
            throw new ApiError(401, "Unauthorized Request - No token provided. Please include token in Authorization header as 'Bearer <token>' or send accessToken in cookies.")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload

        const user = await User.findById(decodedToken._id).select("-password -accessToken")

        if(!user) {
            throw new ApiError(401, "Invalid Access Token - User not found")
        }

        req.user = user
        next()
        
    } catch (error) {
        if(error instanceof ApiError) {
            throw error
        }
        throw new ApiError(401, (error as Error)?.message || "Invalid access token")
    }
})

export const verifyAdmin = asyncHandler( async(req: IRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        throw new ApiError(401, "Unauthorized Request")
    }

    if(req.user.role !== 'admin') {
        throw new ApiError(403, "Forbidden: Admin access required")
    }

    next()
})