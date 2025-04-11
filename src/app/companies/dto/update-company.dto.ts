import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsEmail, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {

    @IsString()
    @IsOptional()
    @MaxLength(50)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    business?: string;

    @IsOptional()
    @Matches(/^[\d\-\.]{10,20}$/, {message: 'El número de teléfono debe comenzar con 3 y tener exactamente 10 dígitos'})
    phone?: string;

    @IsEmail()
    @IsOptional()
    @MaxLength(50)
    @IsString()
    email?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    city?: string;
}
