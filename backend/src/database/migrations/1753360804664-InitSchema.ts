import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1753360804664 implements MigrationInterface {
	name = 'InitSchema1753360804664'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "cardId" integer, CONSTRAINT "UQ_likes_user_card" UNIQUE ("userId", "cardId"), CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'PUBLISHER', 'VISITOR')`
		)
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "fullName" character varying(200), "dateOfBirth" date, "role" "public"."users_role_enum" NOT NULL DEFAULT 'VISITOR', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_4b2bf18167e94dce386d714c67f" UNIQUE ("fullName"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TYPE "public"."cards_status_enum" AS ENUM('DRAFT', 'AWAITING_APPROVAL', 'APPROVED')`
		)
		await queryRunner.query(
			`CREATE TYPE "public"."cards_category_enum" AS ENUM('BIRTHDAY', 'WELCOME', 'WORK_ANNIVERSARY', 'NEW_YEAR', 'COMPANY_ANNIVERSARY', 'GENERAL')`
		)
		await queryRunner.query(
			`CREATE TYPE "public"."cards_language_enum" AS ENUM('EN', 'DE', 'UA')`
		)
		await queryRunner.query(
			`CREATE TABLE "cards" ("id" SERIAL NOT NULL, "description" character varying(300) NOT NULL, "imageUrl" character varying(1024) NOT NULL, "status" "public"."cards_status_enum" NOT NULL DEFAULT 'DRAFT', "category" "public"."cards_category_enum" NOT NULL, "language" "public"."cards_language_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "UQ_cba5f9590b6d2b156fb8c830011" UNIQUE ("description"), CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_cba5f9590b6d2b156fb8c83001" ON "cards" ("description") `
		)
		await queryRunner.query(
			`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "likes" ADD CONSTRAINT "FK_8f47aedf5e2e11f41c954ebd5e9" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "cards" ADD CONSTRAINT "FK_01577f9223f8ab2d0576e205e1c" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "cards" DROP CONSTRAINT "FK_01577f9223f8ab2d0576e205e1c"`
		)
		await queryRunner.query(
			`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`
		)
		await queryRunner.query(
			`ALTER TABLE "likes" DROP CONSTRAINT "FK_8f47aedf5e2e11f41c954ebd5e9"`
		)
		await queryRunner.query(
			`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`
		)
		await queryRunner.query(
			`DROP INDEX "public"."IDX_cba5f9590b6d2b156fb8c83001"`
		)
		await queryRunner.query(`DROP TABLE "cards"`)
		await queryRunner.query(`DROP TYPE "public"."cards_language_enum"`)
		await queryRunner.query(`DROP TYPE "public"."cards_category_enum"`)
		await queryRunner.query(`DROP TYPE "public"."cards_status_enum"`)
		await queryRunner.query(`DROP TABLE "users"`)
		await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
		await queryRunner.query(`DROP TABLE "refresh_tokens"`)
		await queryRunner.query(`DROP TABLE "likes"`)
	}
}
