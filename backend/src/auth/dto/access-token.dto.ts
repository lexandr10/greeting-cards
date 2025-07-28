import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class AccessTokenResponse {
	@Field()
	accessToken: string
}
