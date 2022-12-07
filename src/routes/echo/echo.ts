import Router from 'koa-router';
import { HelloRequestType, IHelloRequestContext } from './types';

const router = new Router();

router.get('/testGet', async (ctx) => {
  ctx.body = { message: 'Hello' };
});

router.post('/testPost', async (ctx: IHelloRequestContext) => {
  ctx.body = <HelloRequestType>ctx.request.body;
});

export default router;
