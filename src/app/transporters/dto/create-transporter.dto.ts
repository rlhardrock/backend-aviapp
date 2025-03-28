import { IsOptional, IsString } from "class-validator";

export class CreateTransporterDto {

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsString()
    phone?: string;

    @IsString()
    transporterId: string;

}
