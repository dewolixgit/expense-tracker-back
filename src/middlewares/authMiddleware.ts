import { Context, Next } from 'koa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models';

const authMiddleware = async (ctx: Context, next: Next) => {
  if (ctx.method === 'OPTIONS') {
    return next;
  }

  try {
    const token = ctx.headers.authorization?.split(' ')[1]; // Bearer <TOKEN>

    if (!token) {
      ctx.body = {
        message: 'Not authenticated',
      };
      ctx.status = 401;
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('Authentication error');
    }

    // should get { userId: ..., ... }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    console.log('userId in authMiddleware', userId);

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      ctx.body = {
        message: 'User not found',
      };
      ctx.status = 400;
      return;
    }

    ctx.user = user;

    await next();
  } catch (e) {
    ctx.response.body = {
      message: 'Something is wrong',
    };
    ctx.response.status = 500;
  }
};

export default authMiddleware;
