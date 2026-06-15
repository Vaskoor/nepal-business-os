import { IsString, IsOptional } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsOptional()
  pan?: string;

  @IsOptional()
  address?: string;
}
