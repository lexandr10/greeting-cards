import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { ENV } from './config/env'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(new ValidationPipe())

	app.use(cookieParser())

	app.enableCors({
		origin: `http://localhost:${ENV.FRONT_PORT}`,
		credentials: true
	})

	const port = ENV.PORT

	await app.listen(port)
	console.log(`Application is running on: http://localhost:${port}/graphql`)
}
bootstrap()
