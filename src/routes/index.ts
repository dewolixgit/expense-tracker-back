import echoRouter from './echo';
import Router from 'koa-router';

const router = new Router();

router.use(echoRouter.routes());

export default router;
