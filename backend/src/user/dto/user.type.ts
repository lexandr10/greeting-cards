import { ObjectType, Field, Int } from '@nestjs/graphql'
import { UserRole } from 'src/database/enums/user-role.enum'

@ObjectType()
export class UserType {
	@Field(() => Int)
	id: number

	@Field()
	email: string

	@Field({ nullable: true })
	fullName?: string

	@Field({ nullable: true })
	dateOfBirth?: string

	@Field(() => UserRole)
	role: UserRole

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date
}
