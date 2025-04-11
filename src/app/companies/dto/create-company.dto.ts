import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength } from "class-validator";

export class CreateCompanyDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    business: string;

    @IsNotEmpty()
    @Matches(/^[\d\-\.]{10,20}$/, {message: 'El número de teléfono debe comenzar con 3 y tener exactamente 10 dígitos'})
    phone: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    city: string;
}
