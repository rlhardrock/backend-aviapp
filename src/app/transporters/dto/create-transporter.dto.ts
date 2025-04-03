import { IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class CreateTransporterDto {

    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    @MaxLength(50)
    lastName: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsString()
    taxpayer: string;

}
