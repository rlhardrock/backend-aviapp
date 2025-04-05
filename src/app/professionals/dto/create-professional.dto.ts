import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength } from "class-validator";

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
    
    @IsNotEmpty()
    @Matches(/^\d{10}$/, { message: 'El número debe contener exactamente 10 dígitos.' })
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
