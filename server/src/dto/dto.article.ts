import { ApiProperty } from '@nestjs/swagger';
import { DtoUser } from './dto.user';
import { DtoSubscribe } from './dto.subscribe';

export class DtoArticle {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => DtoUser })
  user?: DtoUser;

  @ApiProperty({ type: () => DtoSubscribe })
  subscribe?: DtoSubscribe;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  type?: string;

  @ApiProperty()
  shortDesc?: string;

  @ApiProperty()
  text?: string;

  @ApiProperty()
  image?: string[];

  @ApiProperty()
  likes?: number;

  @ApiProperty()
  сhat?: string;

  @ApiProperty()
  comments?: number;

  @ApiProperty()
  created_at?: Date;

  @ApiProperty()
  updated_at?: Date;
}
