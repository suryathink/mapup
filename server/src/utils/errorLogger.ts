import { Request } from "express";
import log4js from "log4js";
const logger = log4js.getLogger("api");

export const logApiError = async (req: Request, error: Error) => {
  const { method, originalUrl, body, query, params } = req;
  const requestData = {
    method,
    url: originalUrl,
    body,
    query,
    params,
  };
  logger.error("API Error:", {
    request: requestData,
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
};
