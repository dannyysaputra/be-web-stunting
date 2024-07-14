import { Request, Response, NextFunction } from 'express';

export const onLost = (req: Request, res: Response) => {
  res.status(404).json({
    status: "FAIL",
    message: "Route not found!",
  });
};

export const onError = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: "ERROR",
    error: {
      name: err.name,
      message: err.message,
    },
  });
};