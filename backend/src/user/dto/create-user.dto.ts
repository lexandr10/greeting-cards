import { UserRole } from 'src/database/enums/user-role.enum'

export class CreateUserDto {
	email: string
	password: string
	fullName?: string
	dateOfBirth?: string
	role: UserRole
}
