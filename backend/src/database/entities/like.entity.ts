import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	Unique
} from 'typeorm'

import { User } from './user.entity'
import { Card } from './card.entity'

@Entity({ name: 'likes' })
@Unique('UQ_likes_user_card', ['user', 'card'])
export class Like {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
	user: User

	@ManyToOne(() => Card, card => card.likes, { onDelete: 'CASCADE' })
	card: Card

	@CreateDateColumn()
	createdAt: Date
}
