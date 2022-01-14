import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@ObjectType('File')
@Entity('local_files')
export class LocalFile extends BaseEntity {
  @Field()
  @Column()
  filename: string;

  @Field()
  @Column()
  path: string;

  constructor(filename: string, path: string) {
    super();

    this.filename = filename;
    this.path = path;
  }
}
