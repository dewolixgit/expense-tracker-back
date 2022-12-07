import Router from 'koa-router';
import { echoRouter } from './echo';

const router = new Router();

router.use(echoRouter.routes());

export default router;
