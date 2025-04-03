import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class CreateCompanyDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    business: string;

    @IsPhoneNumber('CO')
    @IsNotEmpty()
    @MaxLength(20)
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
