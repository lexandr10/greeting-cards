import {
	Injectable,
	NotFoundException,
	ConflictException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Like } from 'src/database/entities/like.entity'
import { Card } from 'src/database/entities/card.entity'
import { User } from 'src/database/entities/user.entity'

@Injectable()
export class LikeService {
	constructor(
		@InjectRepository(Like) private likeRepo: Repository<Like>,
		@InjectRepository(Card) private cardRepo: Repository<Card>
	) {}

	async likeCard(userId: number, cardId: number): Promise<boolean> {
	
		const cardExists = await this.cardRepo.exist({ where: { id: cardId } })
		if (!cardExists) {
			throw new NotFoundException(`Card with ID ${cardId} not found`)
		}

		
		const already = await this.likeRepo.exist({
			where: {
				user: { id: userId },
				card: { id: cardId }
			}
		})
		if (already) {
			throw new ConflictException('You have already liked this card')
		}

		
		await this.likeRepo.save(
			this.likeRepo.create({
				user: { id: userId } as any, 
				card: { id: cardId } as any
			})
		)
		return true
	}

	async unlikeCard(userId: number, cardId: number): Promise<boolean> {
		const result = await this.likeRepo.delete({
			user: { id: userId },
			card: { id: cardId }
		})
		return result.affected > 0
	}
}
