import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await Promise.resolve(requestHandler(req, res, next));
        } catch (error) {
            next(error);
        }
    };
};

export { asyncHandler };