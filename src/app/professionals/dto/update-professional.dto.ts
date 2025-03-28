import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalDto } from './create-professional.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator/types/decorator/decorators';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {

    @IsString()
    @IsOptional()   
    sex?: string;
    
    @IsString()
    @IsOptional()
    professionalLicense?: string;
    
    @IsString()
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsOptional()
    lastName?: string;
    
    @IsString()
    @IsOptional()
    phone?: string;
    
    @IsString()
    @IsOptional()
    taxpayerId?: string;
    
    @IsEmail()
    @IsOptional()
    email?: string;
    
    @IsString()
    @IsOptional()
    role?: string;
    
    @IsString()
    @IsOptional()
    status?: string;
}
