import { PartialType } from '@nestjs/mapped-types';
import { CreateTransporterDto } from './create-transporter.dto';
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength } from 'class-validator';

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
    @Matches(/^\d{10}$/, { message: 'El número debe contener exactamente 10 dígitos.' })
    phone?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    taxpayer?: string;
}
