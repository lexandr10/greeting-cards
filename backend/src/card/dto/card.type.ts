import { ObjectType, Field, Int, ResolveField , Parent} from '@nestjs/graphql'

import { CardStatus } from 'src/database/enums/card-status.enum'
import { Category } from 'src/database/enums/category.enum'
import { Language } from 'src/database/enums/language.enum.role'
import { UserType } from 'src/user/dto/user.type'

@ObjectType()
export class CardType {
	@Field(() => Int)
	id: number

	@Field()
	description: string

	@Field()
	imageUrl: string

	@Field(() => Category)
	category: Category

	@Field(() => Language)
	language: Language

	@Field(() => CardStatus)
	status: CardStatus

	@Field(() => UserType)
	author: UserType

	@Field()
	createdAt: string

	@Field()
	updatedAt: string

	@Field(() => Int)
	likesCount: number

	@Field()
	likedByMe: boolean
}
