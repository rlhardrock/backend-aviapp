import { IsString, IsEmail, IsDateString, IsNotEmpty, MaxLength, IsPhoneNumber, Matches } from 'class-validator';

export class CreateUserDto {
    
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
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
  @Matches(/^[\d\-\.]{10,20}$/, {message: 'El número de teléfono debe comenzar con 3 y tener exactamente 10 dígitos'})
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

  @IsDateString({}, { message: 'La fecha debe estar en formato ISO: YYYY-MM-DD' })
  @IsNotEmpty()
  dateBirth: string;
}
