import { IsString, IsEnum } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsEnum(['income', 'expense'])
  type: string;
}
