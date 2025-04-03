import { PartialType } from '@nestjs/mapped-types';
import { CreateTruckDto } from './create-truck.dto';
import { IsNumber, IsString, IsOptional, Min, MaxLength } from 'class-validator';

export class UpdateTruckDto extends PartialType(CreateTruckDto) {

    @IsString()
    @IsOptional()
    @MaxLength(25)
    brand?: string;
   
    @IsString()
    @IsOptional()
    @MaxLength(25)
    model?: string;

    @IsString()
    @IsOptional()
    @MaxLength(25)
    paint?: string;

    @IsNumber()
    @IsOptional()
    @Min(1950)
    year?: number;

    @IsString()
    @IsOptional()
    @MaxLength(25)
    plate?: string;

    @IsString()
    @IsOptional()
    @MaxLength(25)
    trailer?: string;
}
