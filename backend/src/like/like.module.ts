import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Like } from 'src/database/entities/like.entity'
import { Card } from 'src/database/entities/card.entity'
import { LikeService } from './like.service'
import { LikeResolver } from './like.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Like, Card])],
	providers: [LikeService, LikeResolver]
})
export class LikeModule {}
