import { PartialType } from '@nestjs/mapped-types';
import { CreateTruckDto } from './create-truck.dto';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateTruckDto extends PartialType(CreateTruckDto) {

    @IsString()
    @IsOptional()
    brand?: string;
   
    @IsString()
    @IsOptional()
    model?: string;

    @IsString()
    @IsOptional()
    paint?: string;

    @IsNumber()
    @IsOptional()
    year?: number;

    @IsString()
    @IsOptional()
    plate?: string;
}
