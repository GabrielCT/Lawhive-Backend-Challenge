import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
  IsNumber,
  Max,
  ValidateIf,
  IsMongoId,
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

  @IsString()
  @IsIn(['Fixed-Fee', 'No-Win-No-Fee'])
  feeStructure: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @ValidateIf((o) => o.feeStructure === 'Fixed-Fee')
  feeAmount?: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 3,
  })
  @Max(1.0)
  @Min(0.0)
  @ValidateIf((o) => o.feeStructure === 'No-Win-No-Fee')
  feePercentage?: number;
}

export class GetPostingsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  limit? = 20;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset? = 0;

  @IsIn(['title', 'created'])
  @IsOptional()
  sortBy? = 'title';

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder? = 'asc';

  @IsString()
  @IsEmail()
  @IsOptional()
  posterEmail?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  clientEmail?: string;
}

export class PayPostingDto {
  @IsMongoId()
  _id: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsOptional() // only optional when the job is Fixed-Fee, checked later in the other cases
  settlementAmount?: number;
}
