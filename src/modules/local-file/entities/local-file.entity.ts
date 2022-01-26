import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('local_files')
export class LocalFile extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  path: string;
}
