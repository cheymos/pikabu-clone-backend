import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIncrementCommentsCountTriggerFunc1643211205605
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION increment_comments_count()
            RETURNS TRIGGER AS $$
            BEGIN
                IF (TG_OP = 'INSERT') THEN
                    UPDATE posts SET "commentsCount" = "commentsCount" + 1 WHERE id = NEW."postId";
                    RETURN NEW;
                END IF;
                IF (TG_OP = 'DELETE') THEN
                    UPDATE posts SET "commentsCount" = "commentsCount" - 1 WHERE id = OLD."postId";
                    RETURN OLD;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION increment_likes_or_dislikes_post`);
  }
}
