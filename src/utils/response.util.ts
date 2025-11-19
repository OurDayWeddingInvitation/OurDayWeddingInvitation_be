import { Response } from "express";

const sendResponse = (
    res: Response,
    status: any,
    data: any,
    messages: any,
    error: any
  ) => {
  return res.status(status).json({
    status,
    error,
    messages,
    data
  });
};

export const respondSuccess = (
  res: Response,
  status = 200,
  messages: any = null,
  data: any = null,
) => {
  return sendResponse(res, status, data, messages, null);
};

export const respondError = (
  res: Response,
  status: any = 400,
  messages: any = null,
  // error: any
) => {
  return sendResponse(res, status, null, messages, null);
};
