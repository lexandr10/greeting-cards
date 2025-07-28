import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, Length, Matches, IsOptional } from 'class-validator'

@InputType()
export class SignupInput {
	@Field()
	@IsEmail()
	email: string

	@Field()
	@Length(8, 32, {
		message: 'Password must be between 8 and 32 characters'
	})
	@Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\W)/, {
		message:
			'Password must contain upper, lower case letters and at least one special character'
	})
	password: string

	@Field({ nullable: true })
	@IsOptional()
	@Length(2, 200)
	fullName?: string

	@Field({ nullable: true })
	@IsOptional()
	dateOfBirth?: string
}
