import Router from 'koa-router';
import {
  CategoryType,
  CreateCategoryRequestType,
  DeleteCategoryRequestType,
  EditCategoryRequestType,
  ICategoriesRequestContext,
  ICategoryRequestContext,
} from './types';
import { Category, Expense } from '../../models';
import {
  createCategoryDataValidator,
  deleteCategoryDataValidator,
  editCategoryDataValidator,
} from './validation';
import { authMiddleware } from '../../middlewares';
import { IMessageRequestContext } from '../../types';
import sequelize from '../../db';

const router = new Router();

// Admin route
// /api/categories/getAll
router.get(
  '/getAll',
  authMiddleware,
  async (ctx: ICategoriesRequestContext) => {
    try {
      const categories = await Category.findAll({
        order: sequelize.col('createdAt'),
      });

      ctx.body = {
        categories: categories as unknown as CategoryType[],
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

// /api/categories/get
router.get('/get', authMiddleware, async (ctx: ICategoriesRequestContext) => {
  try {
    const user = ctx.user.dataValues;
    const categories = await Category.findAll({
      where: {
        userId: user.id,
      },
      order: sequelize.col('createdAt'),
    });

    ctx.body = {
      categories: (categories as unknown as CategoryType[]).sort(
        (a, b) => a.id - b.id
      ),
    };
    ctx.status = 200;
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Something is wrong',
    };
  }
});

// api/categories/create
router.post(
  '/create',
  authMiddleware,
  createCategoryDataValidator,
  async (ctx: ICategoryRequestContext) => {
    try {
      const { name, color } = <CreateCategoryRequestType>ctx.request.body;
      const user = ctx.user.dataValues;

      const existing = await Category.findOne({
        where: {
          name,
          userId: user.id,
        },
      });

      if (existing) {
        ctx.status = 400;
        ctx.body = {
          message: 'Category with this name already exists',
        };
        return;
      }

      const created = await Category.create({ name, color, userId: user.id });

      ctx.status = 200;
      ctx.body = {
        category: created as unknown as CategoryType,
      };
    } catch (e) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: 'Something is wrong',
      };
    }
  }
);

// api/categories/edit
router.post(
  '/edit',
  authMiddleware,
  editCategoryDataValidator,
  async (ctx: ICategoryRequestContext) => {
    try {
      const { id, name, color } = <EditCategoryRequestType>ctx.request.body;
      const user = ctx.user.dataValues;

      const existing = await Category.findOne({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!existing) {
        ctx.status = 400;
        ctx.body = {
          message: 'Category does not exist',
        };
        return;
      }

      const updated = await existing.update({
        name,
        color,
      });

      ctx.status = 200;
      ctx.body = {
        category: updated as unknown as CategoryType,
      };
    } catch (e) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: 'Something is wrong',
      };
    }
  }
);

// api/categories/delete
router.post(
  '/delete',
  authMiddleware,
  deleteCategoryDataValidator,
  async (ctx: IMessageRequestContext) => {
    try {
      const { id } = <DeleteCategoryRequestType>ctx.request.body;
      const user = ctx.user.dataValues;

      console.log('id', id);

      const existing = await Category.findOne({
        where: {
          id,
          userId: user.id,
        },
      });

      console.log('existing', existing);

      if (!existing) {
        ctx.status = 400;
        ctx.body = {
          message: 'Category does not exist',
        };
        return;
      }

      await Expense.destroy({
        where: {
          categoryId: id,
        },
      });

      await existing.destroy();

      ctx.status = 200;
      ctx.body = {
        message: 'Category and its expenses were deleted',
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
