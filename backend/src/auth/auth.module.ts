import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { JwtStrategy } from './strategies/jwt.straregy'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { User } from 'src/database/entities/user.entity'
import { RefreshToken } from 'src/database/entities/refresh-token.entity'
import { RefreshTokenService } from './refresh-token.service'
import { UserModule } from 'src/user/user.module'

@Module({
	imports: [
		ConfigModule,
		PassportModule.register({defaultStrategy: 'jwt'}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '15m' }
			}),
			inject: [ConfigService]
		}),
		TypeOrmModule.forFeature([User, RefreshToken]),
		UserModule
	],
	providers: [
		AuthService,
		AuthResolver,
		JwtStrategy,
		GqlAuthGuard,
		RefreshTokenService
	],
	exports: [AuthService]
})
export class AuthModule {}
