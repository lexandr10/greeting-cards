import { InputType, Field } from '@nestjs/graphql'
import { Length, IsEnum } from 'class-validator'

import { Category } from 'src/database/enums/category.enum'
import { Language } from 'src/database/enums/language.enum.role'

@InputType()
export class CreateCardInput {
	@Field()
	@Length(1, 300)
	description: string

	@Field()
	imageUrl: string

	@Field(() => Category)
	@IsEnum(Category)
	category: Category

	@Field(() => Language)
	@IsEnum(Language)
	language: Language
}
