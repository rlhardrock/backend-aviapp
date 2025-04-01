import { IsEmail, IsString } from "class-validator";

export class CreateCompanyDto {

    @IsString()
    name: string;

    @IsString()
    business: string;

    @IsString()
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    city: string;
}
