import { config } from 'dotenv';
config();

import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-logger';
import json from 'koa-json';
import router from './routes';
import bodyParser from 'koa-bodyparser';
import sequelize from './db';
import './models';

const port = process.env.PORT ?? 3000;

const app = new Koa();

app.use(cors());
app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(router.prefix('/api').routes()).use(router.allowedMethods());

const start = async () => {
  try {
    await sequelize?.authenticate();
    console.log('Database connection has been established successfully');

    await sequelize?.sync();

    app.listen(Number(port), async () => {
      console.log(`Koa app started at port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
