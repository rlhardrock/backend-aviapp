import { PartialType } from '@nestjs/mapped-types';
import { CreateBenefitDto } from './create-benefit.dto';
import { IsDate, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class UpdateBenefitDto extends PartialType(CreateBenefitDto) {
    @IsOptional()
    @IsString()
    @MaxLength(25)
    licenseSupBef?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    license?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    placa?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    business?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    taxpayer?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    idRemision?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    idPlanSanitario?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    regionProcedencia?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    granja?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    galpon?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    lineaAves?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    sexo?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    edad?: number;

    @IsOptional()
    @IsDate()
    horaBeneficio?: Date;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    turnoBeneficio?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    pesoPromedioAveGranja?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    avesPorGuacal?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    guacalesVacios?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    guacalesUsados?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    guacalExtra?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    avesRemisionadas?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    avesEnGuacalExtra?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    avesColgadas?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    avesAsfixiadas?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    canalesDecomisadas?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    canalesDestrozadas?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    peso1GuacalVacio?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    pesoTorre7Guacales?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    pesoPromedioAvePlanta?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    diferencialPesoGranjaPlanta?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    pesoTonLoteProcesada?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    canalesObtenidas?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    diferencialAvesEntrega?: number;
}