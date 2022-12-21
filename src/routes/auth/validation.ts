import Joi from 'joi';
import { AuthRequestType } from './types';
import { Context, Next } from 'koa';

const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authValidator = async (ctx: Context, next: Next) => {
  try {
    const { email, password } = <AuthRequestType>ctx.request.body;

    console.log('get body', email, password);

    const validationResult = userRegistrationSchema.validate({
      email,
      password,
    });

    console.log('after validation', validationResult);

    if (validationResult.error) {
      ctx.response.body = {
        message: validationResult.error.message,
      };
      ctx.response.status = 400;
      return;
    }

    await next();
  } catch (e) {
    console.log('register validator error', e);
    ctx.response.body = {
      message: 'Что-то пошло не так',
    };
    ctx.response.status = 500;
  }
};
