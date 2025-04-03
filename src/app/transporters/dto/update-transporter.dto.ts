import { PartialType } from '@nestjs/mapped-types';
import { CreateTransporterDto } from './create-transporter.dto';
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class UpdateTransporterDto extends PartialType(CreateTransporterDto) {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastName?: string;

    @IsOptional()
    @IsPhoneNumber('CO')
    @MaxLength(55)
    phone?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    taxpayer?: string;
}
