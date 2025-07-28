import {
	Injectable,
	ConflictException,
	UnauthorizedException,
	NotFoundException,
	BadRequestException,
	ForbiddenException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { User } from 'src/database/entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UserRole } from 'src/database/enums/user-role.enum'
import { SignupInput } from 'src/auth/dto/signup.input'
import { SigninInput } from 'src/auth/dto/signin.input'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>
	) {}
	async findByEmail(email: string): Promise<User | null> {
		return this.userRepo.findOne({ where: { email } })
	}

	async findById(id: number): Promise<User> {
		const user = await this.userRepo.findOne({ where: { id } })
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}
		return user
	}

	async findAll(): Promise<User[]> {
		return this.userRepo.find()
	}

	async create(data: CreateUserDto): Promise<User> {
		const user = this.userRepo.create(data)
		return this.userRepo.save(user)
	}

	async update(id: number, data: Partial<CreateUserDto>): Promise<User> {
		await this.userRepo.update(id, data)
		return this.findById(id)
	}

	async updateRole(id: number, role: UserRole): Promise<User> {
		 if (role === UserRole.ADMIN) {
				throw new ForbiddenException('Cannot assign ADMIN role')
			}
		await this.userRepo.update(id, { role })
		return this.findById(id)
	}

	async registerUser(input: SignupInput): Promise<User> {
		const dto = plainToInstance(SignupInput, input)
		const errors = await validate(dto)
		if (errors.length) {
			const messages = errors.map(err => Object.values(err.constraints || {})).flat()

			throw new BadRequestException(messages.join('; '))
		}

		const fullName = input.fullName?.trim()
		if (fullName) {
			if (await this.findByFullName(fullName)) {
				throw new ConflictException('Full name already taken')
			}
		}

		const existingUser = await this.findByEmail(input.email)
		if (existingUser) throw new ConflictException('Email already in use')

		const existingCount = await this.userRepo.count()
		const role = existingCount === 0 ? UserRole.ADMIN : UserRole.VISITOR

		const hashed = await bcrypt.hash(input.password, 10)
		return this.create({
			email: input.email,
			password: hashed,
			role,
			...(input.fullName ? { fullName: input.fullName } : {}),
			...(input.dateOfBirth ? { dateOfBirth: input.dateOfBirth } : {})
		})
	}

	async findByFullName(fullName: string): Promise<User> {
		const user = await this.userRepo.findOne({ where: { fullName } })

		return user

	}

	async validateUser(input: SigninInput): Promise<User> {
		const user = await this.findByEmail(input.email)
		if (!user) throw new UnauthorizedException('Invalid credentials')
		const match = await bcrypt.compare(input.password, user.password)
		if (!match) throw new UnauthorizedException('Invalid credentials')
		return user
	}
}
