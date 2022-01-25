import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIncrementLikesOrDislikePostCommentTriggerFunc1643103205000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION increment_likes_or_dislikes_post_comment()
            RETURNS TRIGGER AS $$
            BEGIN
                IF (TG_OP = 'UPDATE') THEN
                    IF (NEW.value = '-1') THEN
                        UPDATE post_comments SET likes = likes - 1 WHERE id = NEW."commentId";
                    ELSEIF (NEW.value = '1') THEN
                        UPDATE post_comments SET dislikes = dislikes - 1 WHERE id = NEW."commentId";
                    END IF;
                END IF;
                IF (NEW.value = '-1') THEN
                    UPDATE post_comments SET dislikes = dislikes + 1 WHERE id = NEW."commentId";
                ELSEIF (NEW.value = '1') THEN
                    UPDATE post_comments SET likes = likes + 1 WHERE id = NEW."commentId";
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION increment_likes_or_dislikes_post_comment`)
    }

}
