import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseSeed1643104797688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO posts(title, description, "ownerId") VALUES('Epic title', 'Epic description', 'yLxqxQc0v0LAGfzvrBNKph0fFvfMKTgu')`,
    );

    await queryRunner.query(
      `INSERT INTO post_images("filePath", "postId") VALUES('Path to file', 1)`,
    );

    await queryRunner.query(
      `INSERT INTO post_tags(name, "postId") VALUES('Epic post tag', 1)`,
    );

    await queryRunner.query(
      `INSERT INTO post_comments(text, "postId", "ownerId") VALUES('Simple comment text', 1, 'yLxqxQc0v0LAGfzvrBNKph0fFvfMKTgu')`,
    );

    await queryRunner.query(
      `INSERT INTO post_comment_images("filePath", "commentId") VALUES('Path to file', 1)`,
    );

    await queryRunner.query(
      `INSERT INTO bookmarks("itemId", type, "ownerId") VALUES(1, '1', 'yLxqxQc0v0LAGfzvrBNKph0fFvfMKTgu')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
