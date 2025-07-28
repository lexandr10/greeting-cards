import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { Card } from './entities/card.entity'
import { User } from './entities/user.entity'
import { Like } from './entities/like.entity'
import { ENV } from 'src/config/env'
import { RefreshToken } from './entities/refresh-token.entity'

export const typeOrmConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: ENV.DB_HOST,
	port: ENV.DB_PORT,
	username: ENV.DB_USERNAME,
	password: ENV.DB_PASSWORD,
	database: ENV.DB_NAME,
	entities: [Card, User, Like, RefreshToken],
	synchronize: false,
	migrations: ['dist/database/migrations/*.js']
}

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: ENV.DB_HOST,
	port: ENV.DB_PORT,
	username: ENV.DB_USERNAME,
	password: ENV.DB_PASSWORD,
	database: ENV.DB_NAME,
	entities: [Card, User, Like, RefreshToken],
	migrations: ['src/database/migrations/*.ts']
})
