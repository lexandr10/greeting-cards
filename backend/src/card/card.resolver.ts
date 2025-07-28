import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { UserRole } from 'src/database/enums/user-role.enum'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CardService } from './card.service'
import { CardType } from './dto/card.type'
import { CreateCardInput } from './dto/create-card.input'
import { UpdateCardInput } from './dto/update-card.input'
import { User } from 'src/database/entities/user.entity'
import { Card } from 'src/database/entities/card.entity'

@Resolver(() => CardType)
export class CardResolver {
	constructor(private readonly cardService: CardService) {}

	@Query(() => [CardType])
	@UseGuards(GqlAuthGuard)
	cards(
		@Args('onlyMine', { type: () => Boolean, defaultValue: false })
		onlyMine: boolean,
		@CurrentUser() user: User
	) {
		if (onlyMine) {
			return this.cardService.findMy(user.id)
		}
		return this.cardService.findAll()
	}

	@Query(() => CardType)
	@UseGuards(GqlAuthGuard)
	card(@Args('id', { type: () => Int }) id: number) {
		return this.cardService.findOne(id)
	}

	@ResolveField(() => Int)
	async likesCount(@Parent() card: Card): Promise<number> {
		return this.cardService.countLikes(card.id)
	}

	@ResolveField(() => Boolean)
	async likedByMe(
		@Parent() card: Card,
		@CurrentUser() user: User
	): Promise<boolean> {
		if (!user) return false
		return this.cardService.hasUserLiked(card.id, user.id)
	}

	@Mutation(() => CardType)
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(UserRole.PUBLISHER, UserRole.ADMIN)
	createCard(@Args('input') input: CreateCardInput, @CurrentUser() user: User) {
		return this.cardService.create(input, user.id)
	}

	@Mutation(() => CardType)
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(UserRole.PUBLISHER, UserRole.ADMIN)
	updateCard(
		@Args('id', { type: () => Int }) id: number,
		@Args('input') input: UpdateCardInput
	) {
		return this.cardService.update(id, input)
	}

	@Mutation(() => Boolean)
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(UserRole.PUBLISHER, UserRole.ADMIN)
	deleteCard(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser() user: User
	) {
		return this.cardService.delete(id, user.id)
	}

	@Query(() => [CardType])
	@UseGuards(GqlAuthGuard)
	@Roles(UserRole.ADMIN, UserRole.PUBLISHER)
	pendingCards() {
		return this.cardService.findPending()
	}

	@Mutation(() => Boolean)
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	approveCard(@Args('id', { type: () => Int }) id: number) {
		return this.cardService.approve(id)
	}
}
