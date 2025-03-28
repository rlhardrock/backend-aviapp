import { IsNumber, IsString } from 'class-validator';

export class CreateTruckDto {
    
    @IsString()
    brand: string;
   
    @IsString()
    model: string;

    @IsString()
    paint: string;

    @IsNumber()
    year: number;

    @IsString()
    plate: string;

    @IsString()
    trailer: string;
}
