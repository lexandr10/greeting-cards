import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { Response, Request } from 'express'

import { AuthService } from './auth.service'
import { SignupInput } from './dto/signup.input'
import { SigninInput } from './dto/signin.input'
import { SignUpResponse } from './dto/sign-up-responce.dto'
import { AccessTokenResponse } from './dto/access-token.dto'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => SignUpResponse)
	signUp(
		@Args('input') input: SignupInput,
		@Context('res') res: Response
	): Promise<SignUpResponse> {
		return this.authService.signUp(input, res)
	}

	@Mutation(() => AccessTokenResponse)
	signIn(
		@Args('input') input: SigninInput,
		@Context('res') res: Response
	): Promise<AccessTokenResponse> {
		return this.authService.signIn(input, res)
	}

	@Mutation(() => AccessTokenResponse)
	async refresh(
		@Context('req') req: Request,
		@Context('res') res: Response
	): Promise<AccessTokenResponse> {
		return this.authService.refresh(req, res)
	}

	@Mutation(() => Boolean)
	async logout(
		@Context('req') req: Request,
		@Context('res') res: Response
	): Promise<boolean> {
		return this.authService.logout(req, res)
	}
}
