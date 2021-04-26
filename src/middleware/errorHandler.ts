
import { NextFunction, Request, Response } from "express";

export class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}


function errorHandler(error: any, request: Request, response: Response, next) {
	const status = error.status || 500;
	const message = error.message || "Something went wrong";
	response
		.status(status)
		.send({
			status,
			message,
		});
}

export default errorHandler