import morgan from "morgan";

export const accessLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length]'
);