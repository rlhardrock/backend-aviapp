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
  @MaxLength(25)
  licenseSup?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  lastName?: string;

  @IsOptional()
  @Matches(/^\d{10}$/, { message: 'El número debe contener exactamente 10 dígitos.' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  taxpayer?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  status?: string;

  @IsOptional()
  @IsDateString()
  @MaxLength(25)
  dateBirth?: Date;
}
