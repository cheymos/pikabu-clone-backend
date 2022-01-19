import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostLikesAndDislikesTrigger1642600231059 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TRIGGER update_post_likes_and_dislikes AFTER INSERT OR UPDATE ON post_votes
            FOR EACH ROW EXECUTE PROCEDURE increment_likes_or_dislikes_post()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_post_likes_and_dislikes ON post_votes`);
    }

}
