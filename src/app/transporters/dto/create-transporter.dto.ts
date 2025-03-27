import { IsString } from "class-validator";

export class CreateTransporterDto {

    @IsString()
    brand: string;

    @IsString()
    model: string;

    @IsString()
    paint: string;

    @IsString()
    year: number;

    @IsString()
    plate: string;

}
