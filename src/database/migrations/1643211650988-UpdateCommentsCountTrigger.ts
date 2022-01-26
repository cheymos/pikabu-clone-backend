import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCommentsCountTrigger1643211650988
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TRIGGER update_comments_count AFTER INSERT OR UPDATE OR DELETE ON post_comments
            FOR EACH ROW EXECUTE PROCEDURE increment_comments_count()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_comments_count ON post_comments`,
    );
  }
}
