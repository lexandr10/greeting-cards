import { MiddlewareConsumer, Module } from '@nestjs/common'
import { GraphQLModule, registerEnumType } from '@nestjs/graphql'
import * as cookieParser from 'cookie-parser'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { typeOrmConfig } from './database/typeorm.config'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { CardModule } from './card/card.module'
import { LikeModule } from './like/like.module'
import { RefreshTokenModule } from './auth/refresh-token.module'
import { UserRole } from './database/enums/user-role.enum'
import { CardStatus } from './database/enums/card-status.enum'
import { Category } from './database/enums/category.enum'
import { Language } from './database/enums/language.enum.role'
import { ENV } from './config/env'

registerEnumType(UserRole, {
	name: 'UserRole',
	description: 'The role of the user in the system'
})
registerEnumType(CardStatus, {
	name: 'CardStatus',
	description: 'The status of the greeting card'
})
registerEnumType(Category, {
	name: 'Category',
	description: 'The category of the greeting card'
})
registerEnumType(Language, {
	name: 'Language',
	description: 'The language of the greeting card'
})

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(typeOrmConfig),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: 'schema.gql',
			context: ({ req, res }) => ({ req, res }),
			cors: {
				origin: `http://localhost:${ENV.FRONT_PORT}`,
				credentials: true
			}
		}),
		AuthModule,
		UserModule,
		RefreshTokenModule,
		CardModule,
		LikeModule
	]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(cookieParser()).forRoutes('graphql')
	}
}
