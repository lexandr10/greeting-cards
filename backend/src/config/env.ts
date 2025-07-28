// src/config/env.ts
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const ENV = {
	DB_HOST: process.env.DB_HOST || 'localhost',
	DB_PORT: parseInt(process.env.DB_PORT || '5432'),
	DB_USERNAME: process.env.DB_USERNAME || 'postgres',
	DB_PASSWORD: process.env.DB_PASSWORD || 'password',
	DB_NAME: process.env.DB_NAME || 'greeting_db',

	NODE_ENV: process.env.NODE_ENV || 'development',

	PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,

	FRONT_PORT: process.env.FRONT_PORT
}
