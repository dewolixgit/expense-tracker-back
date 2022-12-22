import { Context, Next } from 'koa';
import {
  CreateExpenseRequestType,
  DeleteExpenseRequestType,
  GetExpensesQueryType,
} from './types';
import Joi from 'joi';

const zeroDateStringReg =
  /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T00:00:00(.000+)?Z$/;

const getExpensesDataSchema = Joi.object({
  startDate: Joi.string().pattern(zeroDateStringReg, 'zero date iso string'),
  endDate: Joi.string().pattern(zeroDateStringReg, 'zero date iso string'),
});

export const getExpensesDataValidator = async (ctx: Context, next: Next) => {
  try {
    const { startDate, endDate } = <GetExpensesQueryType>ctx.request.query;

    if (!startDate && !endDate) {
      await next();
      return;
    }

    if (!startDate) {
      ctx.response.body = {
        message: 'There is no the start date',
      };
      ctx.response.status = 400;
      return;
    }

    const validationResult = getExpensesDataSchema.validate({
      startDate,
      endDate,
    });

    if (validationResult.error) {
      ctx.response.body = {
        message: validationResult.error.message,
      };
      ctx.response.status = 400;
      return;
    }

    if (!endDate) {
      await next();
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      ctx.response.body = {
        message: 'The start date is later than the end date',
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

const createExpenseDataSchema = Joi.object({
  description: Joi.string().max(64),
  date: Joi.string()
    .pattern(zeroDateStringReg, 'zero date iso string')
    .required(),
  categoryId: Joi.number().required(),
});

export const createExpenseDataValidator = async (ctx: Context, next: Next) => {
  try {
    const { date, description, categoryId } = <CreateExpenseRequestType>(
      ctx.request.body
    );

    const validationResult = createExpenseDataSchema.validate({
      date,
      description,
      categoryId,
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

const deleteExpenseDataSchema = Joi.object({
  id: Joi.number().required(),
});

export const deleteExpenseDataValidator = async (ctx: Context, next: Next) => {
  try {
    const { id } = <DeleteExpenseRequestType>ctx.request.body;

    const validationResult = deleteExpenseDataSchema.validate({
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
