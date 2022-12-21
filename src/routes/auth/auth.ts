import jwt from 'jsonwebtoken';
import Router from 'koa-router';
import bcrypt from 'bcrypt';
import { User } from '../../models';
import { authValidator } from './validation';
import {
  IRegistrationRequestContext,
  AuthRequestType,
  IAuthenticationRequestContext,
} from './types';

const router = new Router();

// api/auth/register
router.post(
  '/register',
  authValidator,
  async (ctx: IRegistrationRequestContext) => {
    try {
      const { email, password } = <AuthRequestType>ctx.request.body;

      const candidate = await User.findOne({
        where: {
          email,
        },
      });

      if (candidate) {
        ctx.status = 400;
        ctx.body = { message: 'User already exists' };
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({
        email,
        password: hashedPassword,
      });

      ctx.body = {
        message: 'User has been created',
      };
      ctx.status = 200;
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        message: 'Something is wrong',
      };
    }
  }
);

// api/auth/authenticate
router.post(
  '/authenticate',
  authValidator,
  async (ctx: IAuthenticationRequestContext) => {
    try {
      const { email, password } = <AuthRequestType>ctx.request.body;

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        ctx.status = 400;
        ctx.body = { message: 'User not found' };
        return;
      }

      const isMatch = await bcrypt.compare(password, user.dataValues.password);

      if (!isMatch) {
        ctx.body = {
          message: 'Wrong password',
        };
        ctx.status = 400;
        return;
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('Authentication error');
      }

      const token = jwt.sign(
        {
          userId: user.dataValues.id,
        },
        process.env.JWT_SECRET
      );

      ctx.body = {
        userId: user.dataValues.id,
        token: token,
      };
      ctx.status = 200;
    } catch (e) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: 'Something is wrong',
      };
    }
  }
);

export default router;
