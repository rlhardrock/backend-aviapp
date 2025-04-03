import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {

    @IsString()
    @IsOptional()
    @MaxLength(50)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    business?: string;

    @IsPhoneNumber('CO')
    @IsOptional()
    @MaxLength(55)
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
