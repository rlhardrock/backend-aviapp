import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class CreateTransporterDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastName: string;

    @IsOptional()
    @IsPhoneNumber('CO')
    @MaxLength(20)
    phone: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    taxpayer: string;

}
