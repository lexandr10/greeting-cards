import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { UserService } from './user.service'
import { UserType } from './dto/user.type'
import { UpdateUserInput } from './dto/update-user.input'
import { UserRole } from 'src/database/enums/user-role.enum'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/roles.decorator'

@Resolver(() => UserType)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => UserType)
	@UseGuards(GqlAuthGuard)
	me(@CurrentUser() user: UserType) {
		return this.userService.findById(user.id)
	}

	@Query(() => [UserType])
	@UseGuards(GqlAuthGuard)
	@Roles(UserRole.ADMIN)
	async users() {
		return this.userService.findAll()
	}

	@Mutation(() => UserType)
	@UseGuards(GqlAuthGuard, RolesGuard)
	async updateUser(@Args('input') input: UpdateUserInput) {
		return this.userService.update(input.id, input)
	}

	@Mutation(() => UserType)
	@UseGuards(GqlAuthGuard)
	async changeUserRole(
		@Args('userId', { type: () => Int }) userId: number,
		@Args('role', { type: () => UserRole }) role: UserRole
	) {
		return this.userService.updateRole(userId, role)
	}

	@Mutation(() => UserType)
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	updateUserRole(
		@Args('userId', { type: () => Int }) userId: number,
		@Args('role', { type: () => UserRole }) role: UserRole
	) {
		return this.userService.updateRole(userId, role)
	}
}
