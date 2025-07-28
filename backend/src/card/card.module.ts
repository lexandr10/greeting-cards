import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reflector } from '@nestjs/core'

import { Card } from 'src/database/entities/card.entity'
import { User } from 'src/database/entities/user.entity'
import { CardService } from './card.service'
import { CardResolver } from './card.resolver'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { Like } from 'src/database/entities/like.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Card, User, Like])],
	providers: [CardService, CardResolver, GqlAuthGuard, RolesGuard, Reflector]
})
export class CardModule {}
