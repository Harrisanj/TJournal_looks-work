import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity, ChatEntity } from './chat.entity';
import { Repository } from 'typeorm';
import { DtoAnswer, DtoChat } from '../dto/dto.chat';
import { UserService } from '../user/user.service';
import { DtoUser } from '../dto/dto.user';

interface IAnswer {
  answer: string;
  to: string;
  id: string;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    @InjectRepository(AnswerEntity)
    private answerRepository: Repository<AnswerEntity>,
    private userService: UserService,
  ) {}

  async createChat(): Promise<DtoChat> {
    const chat = this.chatRepository.create();
    return await this.chatRepository.save(chat);
  }

  async createAnswer(text: string, user: DtoUser): Promise<DtoAnswer> {
    const answer = this.answerRepository.create({ user, text });
    return await this.answerRepository.save(answer);
  }

  async findAnswerAll(id: string, skip: number, take = 5): Promise<DtoAnswer[]> {
    return await this.answerRepository.find({
      where: { chat: { id } },
      relations: ['user', 'nested', 'nested.user'],
      order: { created_at: 'DESC' },
      take,
      skip,
    });
  }

  async findAnswerOne(key: string, val: string): Promise<DtoAnswer> {
    return await this.answerRepository.findOne({ [key]: val }, { relations: ['user', 'nested', 'nested.user'] });
  }

  async findAnswerFull(key: string, val: string): Promise<DtoAnswer> {
    return await this.answerRepository.findOne({ [key]: val }, { relations: ['user', 'answerLikes', 'nested'] });
  }

  async findChat(key: string, val: string): Promise<DtoChat> {
    return await this.chatRepository.findOne({ [key]: val });
  }

  async findChatFull(key: string, val: string): Promise<DtoChat> {
    return await this.chatRepository.findOne({ [key]: val }, { relations: ['answer'] });
  }

  async generateAnswerOne(answerID: string, userID: string): Promise<DtoAnswer> {
    const user = await this.userService.findUser('id', userID);
    const answer = await this.findAnswerOne('id', answerID);
    const myLikes = [].concat(user.answerLikes).includes(answer.id);
    return { ...(await this.findAnswerOne('id', answerID)), myLikes };
  }

  async selectChat(id: string, skip: number, take: number): Promise<DtoChat> {
    const chat = await this.findChatFull('id', id);
    const answer = await this.findAnswerAll(id, skip, take);
    return { ...chat, answer };
  }

  async writeAnswer(body: IAnswer, userID: string): Promise<DtoChat | DtoAnswer> {
    const user = await this.userService.findUser('id', userID);
    const chat = await this.findChatFull('id', body.id);
    const answer = await this.createAnswer(body.answer, user);
    chat.answer.push(answer);
    chat.count = chat.answer.length;
    return await this.chatRepository.save(chat).then(async () => {
      return { ...(await this.findChat('id', body.id)), answer: [answer] };
    });
  }

  async appendAnswer(body: IAnswer, userID: string): Promise<DtoAnswer> {
    const user = await this.userService.findUser('id', userID);
    const answer = await this.findAnswerFull('id', body.id);
    const create = await this.createAnswer(body.answer, user);
    answer.nested.push(create);
    await this.answerRepository.save(answer);
    return await this.findAnswerOne('id', body.id);
  }

  async checkLike(userID: string, answerID, data: DtoAnswer): Promise<any> {
    const { id, myLikes } = data;
    const user = await this.userService.findUser('id', userID);
    const answer = await this.findAnswerFull('id', id);
    const position = answer.answerLikes.findIndex((el) => el.id === userID);

    if (myLikes && position === -1) answer.answerLikes.push(user);
    if (!myLikes && position !== -1) answer.answerLikes.splice(position, 1);

    answer.myLikes = myLikes;
    answer.likes = answer.answerLikes.length;

    return await this.answerRepository.save(answer).then(async () => {
      const find = await this.findAnswerOne('id', answerID);
      return Boolean(find) ? { ...find, myLikes } : {};
    });
  }
}
