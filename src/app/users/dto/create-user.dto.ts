import { IsString, IsEmail, IsDateString, IsNotEmpty, MaxLength, IsPhoneNumber, Matches } from 'class-validator';

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

  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'El número debe contener exactamente 10 dígitos.' })
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
