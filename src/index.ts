import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import router from './routes';

const app = new Koa();

app.use(json());
app.use(logger());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Koa app started');
});
