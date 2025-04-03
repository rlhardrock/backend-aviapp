import { IsString, IsEmail, IsDateString, IsNotEmpty, MaxLength, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
    
  @IsString()
  @IsNotEmpty()
  @MaxLength(7)
  sex: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  licenseSup: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsPhoneNumber('CO')
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  taxpayer: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  role: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  status: string;

  @IsDateString()
  @IsNotEmpty()
  dateBirth: Date;
}
