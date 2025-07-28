import { Client } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const {
	DB_HOST = 'localhost',
	DB_PORT = '5432',
	DB_USERNAME = 'postgres',
	DB_PASSWORD = '',
	DB_NAME = 'greeting_db'
} = process.env

;(async () => {
	const client = new Client({
		host: DB_HOST,
		port: parseInt(DB_PORT, 10),
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: 'postgres'
	})

	try {
		await client.connect()

		const res = await client.query(
			`SELECT 1 FROM pg_database WHERE datname=$1`,
			[DB_NAME]
		)
		if (res.rowCount === 0) {
			await client.query(`CREATE DATABASE "${DB_NAME}"`)
			console.log(`Database '${DB_NAME}' created`)
		} else {
			console.log(`Database '${DB_NAME}' already exists`)
		}
	} catch (err) {
		console.error('Error creating database:', err)
		process.exit(1)
	} finally {
		await client.end()
	}
})()
