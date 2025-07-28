import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from 'src/user/user.service'
import { SignupInput } from './dto/signup.input'
import { SigninInput } from './dto/signin.input'
import { RefreshTokenService } from './refresh-token.service'
import { User } from 'src/database/entities/user.entity'
import { Response, Request } from 'express'
import { ENV } from 'src/config/env'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private refreshSvc: RefreshTokenService
	) {}

	private generateTokens(user: User) {
		const payload = { sub: user.id, email: user.email, role: user.role }
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: '15m'
		})
		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: '7d'
		})
		return {
			accessToken,
			refreshToken
		}
	}

	async signUp(input: SignupInput, res: Response) {
		const user = await this.userService.registerUser(input)
		const { accessToken, refreshToken } = this.generateTokens(user)

		await this.refreshSvc.save(user, refreshToken)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: ENV.NODE_ENV === 'production'
		})

		return { accessToken, user }
	}

	async signIn(input: SigninInput, res: Response) {
		const user = await this.userService.validateUser(input)
		const { accessToken, refreshToken } = this.generateTokens(user)

		await this.refreshSvc.save(user, refreshToken)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: ENV.NODE_ENV === 'production'
		})

		return { accessToken }
	}

	async refresh(req: Request, res: Response) {
		const token = req.cookies['refreshToken']
		if (!token) throw new UnauthorizedException('Refresh token not found')
		const user = await this.refreshSvc.findUser(token)
		const { accessToken, refreshToken: newRefresh } = this.generateTokens(user)

		await this.refreshSvc.save(user, newRefresh)
		res.cookie('refreshToken', newRefresh, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: ENV.NODE_ENV === 'production'
		})
		return { accessToken }
	}

	async logout(req: Request, res: Response) {
		const token = req.cookies['refreshToken']
		if (token) {
			await this.refreshSvc.remove(token)
			res.clearCookie('refreshToken')
			return true
		}
		return false
	}
}
