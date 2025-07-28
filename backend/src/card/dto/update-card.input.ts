import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, Length, IsEnum, IsUrl } from 'class-validator'
import { CardStatus } from 'src/database/enums/card-status.enum'

import { Category } from 'src/database/enums/category.enum'
import { Language } from 'src/database/enums/language.enum.role'

@InputType()
export class UpdateCardInput {
	@Field({ nullable: true })
	@IsOptional()
	@Length(1, 300, {
		message: 'Description must be between 1 and 300 characters.'
	})
	description?: string

	@Field(() => Category, { nullable: true })
	@IsOptional()
	@IsEnum(Category, { message: 'Category must be a valid enum value.' })
	category?: Category

	@Field(() => Language, { nullable: true })
	@IsOptional()
	@IsEnum(Language, { message: 'Language must be a valid enum value.' })
	language?: Language

	@Field(() => CardStatus, { nullable: true })
  status?: CardStatus

	@Field({ nullable: true })
	@IsOptional()
	@IsUrl({}, { message: 'Image URL must be a valid URL.' })
	imageUrl?: string
}
