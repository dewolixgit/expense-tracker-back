import Router from 'koa-router';
import {
  CreateExpenseRequestType,
  DeleteExpenseRequestType,
  ExpenseType,
  GetExpensesQueryType,
  IExpenseRequestContext,
  IExpensesRequestContext,
} from './types';
import { Category, Expense } from '../../models';
import { authMiddleware } from '../../middlewares';
import {
  createExpenseDataValidator,
  deleteExpenseDataValidator,
  getExpensesDataValidator,
} from './validation';
import { Op } from 'sequelize';
import sequelize from '../../db';
import { IMessageRequestContext } from '../../types';

const router = new Router();

// Admin route
// /api/expenses/getAll
router.get(
  '/getAll',
  getExpensesDataValidator,
  async (ctx: IExpensesRequestContext) => {
    try {
      const { startDate, endDate } = <GetExpensesQueryType>ctx.request.query;

      const categoriesId = (await Category.findAll()).map(
        (category) => category.dataValues.id
      );

      if (!endDate && !startDate) {
        const expenses = await Expense.findAll({
          where: {
            categoryId: categoriesId,
          },
          order: sequelize.col('date'),
        });

        ctx.body = {
          expenses: expenses as unknown as ExpenseType[],
        };
        ctx.status = 200;
        return;
      }

      if (startDate && endDate) {
        const expenses = await Expense.findAll({
          where: {
            categoryId: categoriesId,
            date: {
              [Op.gte]: new Date(startDate),
              [Op.lte]: new Date(endDate),
            },
          },
          order: sequelize.col('date'),
        });

        ctx.body = {
          expenses: expenses as unknown as ExpenseType[],
        };
        ctx.status = 200;
        return;
      }

      if (startDate) {
        const expenses = await Expense.findAll({
          where: {
            categoryId: categoriesId,
            date: new Date(startDate),
          },
          order: sequelize.col('date'),
        });

        ctx.body = {
          expenses: expenses as unknown as ExpenseType[],
        };
        ctx.status = 200;
        return;
      }

      throw new Error('Expenses filtering error');
    } catch (e) {
      console.log(e);
      ctx.response.status = 500;
      ctx.response.body = {
        message: 'Something is wrong',
      };
    }
  }
);

// /api/expenses/get
router.get(
  '/get',
  authMiddleware,
  getExpensesDataValidator,
  async (ctx: IExpensesRequestContext) => {
    try {
      const user = ctx.user.dataValues;
      const { startDate, endDate } = <GetExpensesQueryType>ctx.request.query;

      const categoriesId = (
        await Category.findAll({
          where: {
            userId: user.id,
          },
        })
      ).map((category) => category.dataValues.id);

      if (!endDate && !startDate) {
        const expenses = await Expense.findAll({
          where: {
            categoryId: categoriesId,
          },
          include: Category,
          order: [['date', 'DESC']],
        });

        ctx.body = {
          expenses: expenses as unknown as ExpenseType[],
        };
        ctx.status = 200;
        return;
      }

      if (startDate && endDate) {
        const expenses = await Expense.findAll({
          where: {
            categoryId: categoriesId,
            date: {
              [Op.gte]: new Date(startDate),
              [Op.lte]: new Date(endDate),
            },
          },
          include: Category,
          order: [['date', 'DESC']],
        });

        ctx.body = {
          expenses: expenses as unknown as ExpenseType[],
        };
        ctx.status = 200;
        return;
      }

      if (startDate) {
        const expenses = await Expense.findAll({
          where: {
            categoryId: categoriesId,
            date: new Date(startDate),
          },
          include: Category,
          order: [['date', 'DESC']],
        });

        ctx.body = {
          expenses: expenses as unknown as ExpenseType[],
        };
        ctx.status = 200;
        return;
      }

      throw new Error('Expenses filtering error');
    } catch (e) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: 'Something is wrong',
      };
    }
  }
);

// api/expenses/create
router.post(
  '/create',
  authMiddleware,
  createExpenseDataValidator,
  async (ctx: IExpenseRequestContext) => {
    try {
      const user = ctx.user.dataValues;
      const { date, description, categoryId, value } = <
        CreateExpenseRequestType
      >ctx.request.body;

      const existingCategory = await Category.findOne({
        where: {
          id: categoryId,
          userId: user.id,
        },
      });

      if (!existingCategory) {
        ctx.response.status = 400;
        ctx.response.body = {
          message: 'There is no such category',
        };
        return;
      }

      const created = await Expense.create({
        date: new Date(date),
        description,
        categoryId,
        value,
      });

      ctx.status = 200;
      ctx.body = {
        expense: created as unknown as ExpenseType,
      };
    } catch (e) {
      console.log(e);
      ctx.response.status = 500;
      ctx.response.body = {
        message: 'Something is wrong',
      };
    }
  }
);

// api/expenses/delete
router.post(
  '/delete',
  authMiddleware,
  deleteExpenseDataValidator,
  async (ctx: IMessageRequestContext) => {
    try {
      const user = ctx.user.dataValues;
      const { id } = <DeleteExpenseRequestType>ctx.request.body;

      const userCategoriesId = (
        await Category.findAll({
          where: {
            userId: user.id,
          },
        })
      ).map((category) => category.dataValues.id);

      const existing = await Expense.findOne({
        where: {
          id,
          categoryId: userCategoriesId,
        },
      });

      if (!existing) {
        ctx.status = 400;
        ctx.body = {
          message: 'Category does not exist',
        };
        return;
      }

      await existing.destroy();

      ctx.status = 200;
      ctx.body = {
        message: 'Expense was deleted',
      };
    } catch (e) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: 'Something is wrong',
      };
    }
  }
);

export default router;
