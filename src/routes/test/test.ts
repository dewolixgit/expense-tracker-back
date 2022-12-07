import Router from 'koa-router';
import { HelloRequestType, IHelloRequestContext } from './types';

const router = new Router();

// /api/test/testGet
router.get('/testGet', async (ctx) => {
  ctx.body = { message: 'Hello' };
});

// /api/test/testPost
router.post('/testPost', async (ctx: IHelloRequestContext) => {
  ctx.body = <HelloRequestType>ctx.request.body;
});

export default router;
