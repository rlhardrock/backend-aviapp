import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateTruckDto {
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    brand: string;
   
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    model: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    paint: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1950)
    year: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    plate: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    trailer: string;
}
