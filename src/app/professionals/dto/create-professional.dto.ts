import { IsEmail, IsString } from "class-validator/types/decorator/decorators";

export class CreateProfessionalDto {
    
    @IsString()
    sex: string;
    
    @IsString()
    license: string;
    
    @IsString()
    name: string;
    
    @IsString()
    lastName: string;
    
    @IsString()
    phone: string;
    
    @IsString()
    taxpayer: string;
    
    @IsEmail()
    email: string;
    
    @IsString()
    role: string;
    
    @IsString()
    status: string;
}
