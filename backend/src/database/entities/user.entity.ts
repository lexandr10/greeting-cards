import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany
} from 'typeorm'

import { UserRole } from '../enums/user-role.enum'
import { Card } from './card.entity'
import { Like } from './like.entity'
import { RefreshToken } from './refresh-token.entity'

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true, length: 100 })
	email: string

	@Column()
	password: string

	@Column({ nullable: true, length: 200, unique: true })
	fullName?: string

	@Column({ type: 'date', nullable: true })
	dateOfBirth?: string

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.VISITOR
	})
	role: UserRole

	@OneToMany(() => Card, card => card.author)
	cards: Card[]

	@OneToMany(() => Like, like => like.user)
	likes: Like[]

	@OneToMany(() => RefreshToken, refreshToken => refreshToken.user, {
		cascade: true
	})
	refreshTokens: RefreshToken[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
