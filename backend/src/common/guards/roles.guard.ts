import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { ROLES_KEY } from '../decorators/roles.decorator'
import { UserRole } from 'src/database/enums/user-role.enum'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (!required) return true
		const ctx = GqlExecutionContext.create(context)
		const user = ctx.getContext().req.user
		if (!user || !required.includes(user.role)) {
			throw new ForbiddenException('Insufficient permissions')
		}
		return true
	}
}
