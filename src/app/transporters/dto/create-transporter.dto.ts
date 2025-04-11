import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength } from "class-validator";

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
    @Matches(/^[\d\-\.]{10,20}$/, {message: 'El número de teléfono debe comenzar con 3 y tener exactamente 10 dígitos'})
    phone: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    taxpayer: string;

}
