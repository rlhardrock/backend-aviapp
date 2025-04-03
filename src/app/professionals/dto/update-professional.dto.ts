import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalDto } from './create-professional.dto';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {

    @IsString()
    @IsOptional()
    @MaxLength(10)
    sex?: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(25)
    license?: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(25)
    name?: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(25)
    lastName?: string;
    
    @IsPhoneNumber('CO')
    @IsOptional()
    @MaxLength(55)
    phone?: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(25)
    taxpayer?: string;
    
    @IsEmail()
    @IsOptional()
    @MaxLength(50)
    @IsString()
    email?: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(25)
    role?: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(25)
    status?: string;
}
