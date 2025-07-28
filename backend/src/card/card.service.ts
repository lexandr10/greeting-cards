import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Card } from 'src/database/entities/card.entity'
import { CreateCardInput } from './dto/create-card.input'
import { UpdateCardInput } from './dto/update-card.input'
import { CardStatus } from 'src/database/enums/card-status.enum'
import { User } from 'src/database/entities/user.entity'
import { Like } from 'src/database/entities/like.entity'
import { UserRole } from 'src/database/enums/user-role.enum'

@Injectable()
export class CardService {
	constructor(
		@InjectRepository(Card) private cardRepo: Repository<Card>,
		@InjectRepository(User) private userRepo: Repository<User>,
		@InjectRepository(Like) private readonly likeRepo: Repository<Like>
	) {}

	async findAll(): Promise<Card[]> {
		return this.cardRepo.find({
			where: { status: CardStatus.APPROVED },
			order: { createdAt: 'DESC' },
			relations: ['author', 'likes']
		})
	}

	async countLikes(cardId: number): Promise<number> {
		return this.likeRepo.count({ where: { card: { id: cardId } } })
	}

	async hasUserLiked(cardId: number, userId: number): Promise<boolean> {
		const rec = await this.likeRepo.findOne({
			where: {
				card: { id: cardId },
				user: { id: userId }
			}
		})
		return !!rec
	}

	async findOne(id: number): Promise<Card> {
		const card = await this.cardRepo.findOne({
			where: { id },
			relations: ['author', 'likes']
		})
		if (!card) {
			throw new NotFoundException(`Card with ID ${id} not found`)
		}
		return card
	}

	async findPending(): Promise<Card[]> {
		return this.cardRepo.find({
			where: { status: CardStatus.AWAITING_APPROVAL },
			relations: ['author', 'likes'],
			order: { createdAt: 'DESC' }
		})
	}

	async approve(id: number): Promise<boolean> {
		const card = await this.cardRepo.findOne({ where: { id } })
		if (!card) {
			throw new NotFoundException(`Card with ID ${id} not found`)
		}
		card.status = CardStatus.APPROVED
		await this.cardRepo.save(card)
		return true
	}

	async findMy(userId: number): Promise<Card[]> {
		return this.cardRepo.find({
			where: { author: { id: userId } },
			order: { createdAt: 'DESC' },
			relations: ['likes', 'author']
		})
	}

	async create(input: CreateCardInput, userId: number): Promise<Card> {
		const author = await this.userRepo.findOneBy({ id: userId })
		if (!author) throw new NotFoundException('User not found')
		const card = this.cardRepo.create({
			...input,
			status: CardStatus.DRAFT,
			author
		})
		return this.cardRepo.save(card)
	}

	async update(id: number, input: UpdateCardInput): Promise<Card> {
		const card = await this.cardRepo.findOne({
			where: { id },
			relations: ['author']
		})
		if (!card) throw new NotFoundException(`Card with ID ${id} not found`)
		Object.assign(card, input)
		if (card.status === CardStatus.APPROVED && input.status !== CardStatus.APPROVED) {
			card.status = CardStatus.AWAITING_APPROVAL
		}
		return this.cardRepo.save(card)
	}
	async delete(id: number, userId: number): Promise<boolean> {
		const { affected } = await this.cardRepo.delete({
			id,
			author: { id: userId }
		})
		return affected > 0
	}
}
