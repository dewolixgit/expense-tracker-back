import { config } from 'dotenv';
import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import router from './routes';
import bodyParser from 'koa-bodyparser';

config();

const port = process.env.PORT ?? 3000;

const app = new Koa();

app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(router.prefix('/api').routes()).use(router.allowedMethods());

app.listen(Number(port), () => {
  console.log(`Koa app started at port ${port}`);
});
