import Router from 'koa-router';
import { testRouter } from './test';
import { categoriesRouter } from './categories';
import { authRouter } from './auth';
import { expensesRouter } from './expenses';

const router = new Router();

// api/test
router.use(testRouter.prefix('/test').routes());
router.use(authRouter.prefix('/auth').routes());
router.use(categoriesRouter.prefix('/categories').routes());
router.use(expensesRouter.prefix('/expenses').routes());

export default router;
