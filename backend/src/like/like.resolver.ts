import { Resolver, Mutation, Args, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { LikeService } from './like.service'
import { LikeType } from './dto/like.type'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { User } from 'src/database/entities/user.entity'

@Resolver(() => LikeType)
export class LikeResolver {
	constructor(private likeService: LikeService) {}

	@Mutation(() => Boolean)
	@UseGuards(GqlAuthGuard)
	likeCard(
		@Args('cardId', { type: () => Int }) cardId: number,
		@CurrentUser() user: User
	): Promise<boolean> {
		return this.likeService.likeCard(user.id, cardId)
	}

	@Mutation(() => Boolean)
	@UseGuards(GqlAuthGuard)
	unlikeCard(
		@Args('cardId', { type: () => Int }) cardId: number,
		@CurrentUser() user: User
	): Promise<boolean> {
		return this.likeService.unlikeCard(user.id, cardId)
	}
}
