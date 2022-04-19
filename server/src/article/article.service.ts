import { Injectable } from '@nestjs/common';
import { DtoArticle } from '../dto/dto.article';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { DtoUser } from '../dto/dto.user';

interface ICreateArticle {
  title: string;
  text: string;
  file: File;
}

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    private userService: UserService,
    private fileService: FileService,
  ) {}

  async createArticle(id: string, article: ICreateArticle, file: Express.Multer.File): Promise<string> {
    const user = await this.userService.findUser('id', id);
    const fileName = await this.fileService.LoadFile(file);
    const createArticle = await this.articleRepository.create({
      ...article,
      image: [fileName],
      user: user,
    });
    const saveArticle = await this.articleRepository.save(createArticle);
    return saveArticle.id;
  }

  async findArticle(key: string, val: string): Promise<DtoArticle> {
    return await this.articleRepository.findOne({ [key]: val }, { relations: ['user'] });
  }

  async allArticle(number: number, search: string): Promise<DtoArticle[]> {
    const props = { order: { created_at: 'DESC' } } as { where?: any; order?: any };
    const checked = ['created_at', 'likes', 'comments'].includes(search);
    const type = search !== 'all' ? { type: search } : {};

    checked ? (props.order = { [search]: 'DESC' }) : (props.where = type);

    return await this.articleRepository.find({
      ...props,
      take: 5,
      skip: number,
    });
  }

  async shortArticle(number: number): Promise<DtoArticle[]> {
    return await this.articleRepository.find({
      select: ['id', 'title', 'comments'],
      order: { created_at: 'DESC' },
      take: 5,
      skip: number,
    });
  }

  async updateArticle(key: string, val: string, article: DtoArticle): Promise<any> {
    return await this.articleRepository
      .update({ [key]: val }, { ...article })
      .then(async () => await this.findArticle(key, val));
  }

  async deleteArticle(articleID: string): Promise<any> {
    return await this.articleRepository.delete({ id: articleID });
  }
}
