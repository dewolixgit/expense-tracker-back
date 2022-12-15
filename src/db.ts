import { Sequelize } from 'sequelize';

const db = String(process.env.DB) ?? '';
const user = String(process.env.USER) ?? '';
const password = String(process.env.PASSWORD) ?? '';
const host = String(process.env.HOST) ?? '';
const port = Number(process.env.DB_PORT) ?? '';

const sequelize = new Sequelize(db, user, password, {
  dialect: 'postgres',
  host,
  port,
});

export default sequelize;
