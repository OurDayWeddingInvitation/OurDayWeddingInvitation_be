// src/core/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

type SchemaObject = {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

export const validate = (schema: SchemaObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          error: {
            code: 400,
            messages: "잘못된 요청 데이터입니다.",
          },
          message: err.issues,
          data: null,
        });
      }

      next(err);
    }
  };
};
