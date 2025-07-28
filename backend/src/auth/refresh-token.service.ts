import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from 'src/database/entities/user.entity'
import { RefreshToken } from 'src/database/entities/refresh-token.entity'

@Injectable()
export class RefreshTokenService {
	constructor(
		@InjectRepository(RefreshToken)
		private readonly repo: Repository<RefreshToken>
	) {}

	async save(user: User, token: string): Promise<void> {
		await this.repo.delete({ user: { id: user.id } })

		await this.repo.save(this.repo.create({ user, token }))
	}

	async remove(token: string): Promise<void> {
		await this.repo.delete({ token })
	}

	async findUser(token: string): Promise<User> {
		const record = await this.repo.findOne({
			where: { token },
			relations: ['user']
		})
		if (!record) {
			throw new UnauthorizedException('Refresh token not found')
		}
		return record.user
	}
}
