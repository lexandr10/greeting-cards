import { ObjectType, Field } from '@nestjs/graphql'

import { UserType } from '../../user/dto/user.type'

@ObjectType()
export class SignUpResponse {
	@Field()
	accessToken: string

	@Field(() => UserType)
	user: UserType
}
