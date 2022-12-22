import Joi from 'joi';
import { AuthRequestType } from './types';
import { Context, Next } from 'koa';

const userAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authValidator = async (ctx: Context, next: Next) => {
  try {
    const { email, password } = <AuthRequestType>ctx.request.body;

    const validationResult = userAuthSchema.validate({
      email,
      password,
    });

    if (validationResult.error) {
      ctx.response.body = {
        message: validationResult.error.message,
      };
      ctx.response.status = 400;
      return;
    }

    await next();
  } catch (e) {
    ctx.response.body = {
      message: 'Something is wrong',
    };
    ctx.response.status = 500;
  }
};
