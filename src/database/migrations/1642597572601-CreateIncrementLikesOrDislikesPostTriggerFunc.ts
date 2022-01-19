import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIncrementLikesOrDislikesPostTriggerFunc1642597572601 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION increment_likes_or_dislikes_post()
            RETURNS TRIGGER AS $$
            BEGIN
                IF (TG_OP = 'UPDATE') THEN
                    IF (NEW.value = '-1') THEN
                        UPDATE posts SET likes = likes - 1 WHERE id = NEW."postId";
                    ELSEIF (NEW.value = '1') THEN
                        UPDATE posts SET dislikes = dislikes - 1 WHERE id = NEW."postId";
                    END IF;
                END IF;
                IF (NEW.value = '-1') THEN
                    UPDATE posts SET dislikes = dislikes + 1 WHERE id = NEW."postId";
                ELSEIF (NEW.value = '1') THEN
                    UPDATE posts SET likes = likes + 1 WHERE id = NEW."postId";
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION increment_likes_or_dislikes_post`)
    }

}
