import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, Length, Matches, IsOptional } from 'class-validator'

@InputType()
export class CreateUserInput {
	@Field()
	@IsEmail()
	email: string

	@Field()
	@Length(8, 32)
	@Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\W)/, {
		message:
			'Password must contain upper, lower case letters and at least one special character'
	})
	password: string

	@Field({ nullable: true })
	@IsOptional()
	fullName?: string

	@Field({ nullable: true })
	@IsOptional()
	dateOfBirth?: string
}
