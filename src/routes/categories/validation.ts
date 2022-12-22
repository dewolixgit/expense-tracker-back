import Joi from 'joi';
import { Context, Next } from 'koa';
import {
  CreateCategoryRequestType,
  DeleteCategoryRequestType,
  EditCategoryRequestType,
} from './types';

const reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const createCategoryDataSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().pattern(reg, 'hex color').required(),
});

export const createCategoryDataValidator = async (ctx: Context, next: Next) => {
  try {
    const { name, color } = <CreateCategoryRequestType>ctx.request.body;

    const validationResult = createCategoryDataSchema.validate({
      name,
      color,
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

const editCategoryDataSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
  color: Joi.string().pattern(reg, 'hex color'),
});

export const editCategoryDataValidator = async (ctx: Context, next: Next) => {
  try {
    const { id, name, color } = <EditCategoryRequestType>ctx.request.body;

    const validationResult = editCategoryDataSchema.validate({
      id,
      name,
      color,
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

const deleteCategoryDataSchema = Joi.object({
  id: Joi.number().required(),
});

export const deleteCategoryDataValidator = async (ctx: Context, next: Next) => {
  try {
    const { id } = <DeleteCategoryRequestType>ctx.request.body;

    const validationResult = deleteCategoryDataSchema.validate({
      id,
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
