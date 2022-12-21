import Router from 'koa-router';
import { testRouter } from './test';
import { authRouter } from './auth';

const router = new Router();

// api/test
router.use(testRouter.prefix('/test').routes());
router.use(authRouter.prefix('/auth').routes());

export default router;
