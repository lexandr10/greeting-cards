import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	Column
} from 'typeorm'
import { User } from './user.entity'

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	token: string

	@ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
	user: User

	@CreateDateColumn()
	createdAt: Date
}
