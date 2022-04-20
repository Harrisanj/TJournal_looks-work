import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ArticleEntity } from '../article/article.entity';

@Entity({ name: 'subscribe' })
export class SubscribeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (user) => user.subscribe)
  user: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.listening)
  subscribe: UserEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.subscribe)
  article: ArticleEntity[];

  @Column({ default: false })
  sub: boolean;

  @Column({ default: 0 })
  subscribers: number;
}
