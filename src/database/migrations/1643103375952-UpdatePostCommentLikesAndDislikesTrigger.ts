import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostCommentLikesAndDislikesTrigger1643103375952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TRIGGER update_post_comment_likes_and_dislikes AFTER INSERT OR UPDATE ON comment_votes
            FOR EACH ROW EXECUTE PROCEDURE increment_likes_or_dislikes_post_comment()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_post_comment_likes_and_dislikes ON comment_votes`);
    }

}
