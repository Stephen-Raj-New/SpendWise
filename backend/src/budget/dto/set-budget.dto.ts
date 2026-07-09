import { IsString, IsNumber, Min } from 'class-validator';

export class SetBudgetDto {
  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  limit: number;

  @IsString()
  month: string; // "YYYY-MM" format
}
