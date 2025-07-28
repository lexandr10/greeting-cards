import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, Length } from 'class-validator'

@InputType()
export class SigninInput {
	@Field()
	@IsEmail()
	email: string

	@Field()
	@Length(8, 32)
	password: string
}
