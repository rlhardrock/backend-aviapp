import { IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class CreateUserDto {
    
  @IsString()
  sex: string;

  @IsString()
  licenseSup: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  taxpayer: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;

  @IsString()
  status: string;

  @IsDateString()
  dateBirth: Date;
}
