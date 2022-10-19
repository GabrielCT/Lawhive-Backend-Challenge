import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreatePostingDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 4000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;
}

export class GetPostingsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  limit = 20;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset = 0;

  @IsIn(['title', 'created'])
  @IsOptional()
  sortBy = 'title';

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder = 'asc';

  @IsString()
  @IsEmail()
  @IsOptional()
  posterEmail: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  clientEmail: string;
}
