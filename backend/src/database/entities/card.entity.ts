import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	Index
} from 'typeorm'
import { CardStatus } from '../enums/card-status.enum'
import { Category } from '../enums/category.enum'
import { Language } from '../enums/language.enum.role'
import { User } from './user.entity'
import { Like } from './like.entity'

@Entity({ name: 'cards' })
export class Card {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 300, unique: true })
	@Index({ unique: true })
	description: string

	@Column({ type: 'varchar', length: 1024 })
	imageUrl: string

	@Column({ type: 'enum', enum: CardStatus, default: CardStatus.DRAFT })
	status: CardStatus

	@Column({ type: 'enum', enum: Category })
	category: Category

	@Column({ type: 'enum', enum: Language })
	language: Language

	@ManyToOne(() => User, user => user.cards, { onDelete: 'CASCADE' })
	author: User

	@OneToMany(() => Like, like => like.card)
	likes: Like[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
