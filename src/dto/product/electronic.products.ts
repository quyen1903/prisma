import { IsNotEmpty, IsString } from 'class-validator';

export class Electronics{
  @IsNotEmpty()
  @IsString()
  manufacturer: string;

  @IsNotEmpty()
  @IsString()
  models: string;

  @IsNotEmpty()
  @IsString()
  color: string;
}
