import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEmail, IsDateString, MaxLength, IsPhoneNumber, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @IsOptional()
  @IsString()
  @MaxLength(10)
  sex?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  licenseSup?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @Matches(/^[\d\-\.]{10,20}$/, { message: 'El número de teléfono debe comenzar con 3 y tener exactamente 10 dígitos' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxpayer?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe estar en formato ISO: YYYY-MM-DD' })
  @MaxLength(50)
  dateBirth?: string;
}
