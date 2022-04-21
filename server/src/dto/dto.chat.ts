import { ApiProperty } from '@nestjs/swagger';
import { DtoArticle } from './dto.article';
import { DtoUser } from './dto.user';

export class DtoChat {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => DtoArticle })
  article?: DtoArticle;

  @ApiProperty({ type: () => DtoAnswer })
  answer?: DtoAnswer[];
}

export class DtoAnswer {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => DtoChat })
  chat?: DtoChat;

  @ApiProperty({ type: () => DtoUser })
  user?: DtoUser;

  @ApiProperty({ type: () => DtoAnswer })
  inner?: DtoAnswer;

  @ApiProperty({ type: () => DtoAnswer })
  nested?: DtoAnswer[];

  @ApiProperty()
  text: string;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  created_at: Date;
}
