import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateIncomeDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(['Confirmed', 'Processing', 'Failed'])
  @IsOptional()
  status?: string;
}
