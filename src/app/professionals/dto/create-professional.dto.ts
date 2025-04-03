import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from "class-validator/types/decorator/decorators";

export class CreateProfessionalDto {
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(7)
    sex: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    license: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastName: string;
    
    @IsPhoneNumber('CO')
    @IsNotEmpty()
    @MaxLength(20)
    phone: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    taxpayer: string;
    
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    role: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    status: string;
}
