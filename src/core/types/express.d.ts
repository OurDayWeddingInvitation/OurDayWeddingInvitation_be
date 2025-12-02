import { JwtPayload } from '../utils/token.util'; // 너가 만든 타입에 맞춰 수정

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;   // or whatever your decoded type is
    }
  }
}
