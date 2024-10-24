import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class Clothing{
  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsString()
  material: string;
}
