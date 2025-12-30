import { asyncHandler } from "@/utils/AsyncHandler";
import { Response, Request } from "express";

export const me = asyncHandler( async(req: Request, res: Response) => {
    res.status(200).json({
      user: {
        _id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    });
  });
  