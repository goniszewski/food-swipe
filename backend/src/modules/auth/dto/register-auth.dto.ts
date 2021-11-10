import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString({})
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
