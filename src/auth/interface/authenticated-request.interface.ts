import { Request } from 'express';
import { User } from 'src/user/schemas/schema';

export interface AuthenticatedRequest extends Request {
  [x: string]: any;
  user: User;
}
