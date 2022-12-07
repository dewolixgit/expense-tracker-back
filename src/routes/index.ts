import Router from 'koa-router';
import { testRouter } from './test';

const router = new Router();

// api/test
router.use(testRouter.prefix('/test').routes());

export default router;
