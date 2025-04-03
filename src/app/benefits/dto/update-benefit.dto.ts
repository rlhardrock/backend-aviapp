import { PartialType } from '@nestjs/mapped-types';
import { CreateBenefitDto } from './create-benefit.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBenefitDto extends PartialType(CreateBenefitDto) {
    @IsOptional()
    @IsString()
    licenseSupBef?: string;

    @IsOptional()
    @IsString()
    license?: string;

    @IsOptional()
    @IsString()
    placa?: string;

    @IsOptional()
    @IsString()
    business?: string;

    @IsOptional()
    @IsString()
    taxpayer?: string;

    @IsOptional()
    @IsString()
    idRemision?: string;

    @IsOptional()
    @IsString()
    idPlanSanitario?: string;

    @IsOptional()
    @IsString()
    regionProcedencia?: string;

    @IsOptional()
    @IsString()
    granja?: string;

    @IsOptional()
    @IsString()
    galpon?: string;

    @IsOptional()
    @IsString()
    lineaAves?: string;

    @IsOptional()
    @IsString()
    sexo?: string;

    @IsOptional()
    @IsNumber()
    edad?: number;

    @IsOptional()
    @IsDate()
    horaBeneficio?: Date;

    @IsOptional()
    @IsNumber()
    turnoBeneficio?: number;

    @IsOptional()
    @IsNumber()
    pesoPromedioAveGranja?: number;

    @IsOptional()
    @IsNumber()
    avesPorGuacal?: number;

    @IsOptional()
    @IsNumber()
    guacalesVacios?: number;

    @IsOptional()
    @IsNumber()
    guacalesUsados?: number;

    @IsOptional()
    @IsNumber()
    guacalExtra?: number;

    @IsOptional()
    @IsNumber()
    avesRemisionadas?: number;

    @IsOptional()
    @IsNumber()
    avesEnGuacalExtra?: number;

    @IsOptional()
    @IsNumber()
    avesColgadas?: number;

    @IsOptional()
    @IsNumber()
    avesAsfixiadas?: number;

    @IsOptional()
    @IsNumber()
    canalesDecomisadas?: number;

    @IsOptional()
    @IsNumber()
    canalesDestrozadas?: number;

    @IsOptional()
    @IsNumber()
    peso1GuacalVacio?: number;

    @IsOptional()
    @IsNumber()
    pesoTorre7Guacales?: number;

    @IsOptional()
    @IsNumber()
    pesoPromedioAvePlanta?: number;

    @IsOptional()
    @IsNumber()
    diferencialPesoGranjaPlanta?: number;

    @IsOptional()
    @IsNumber()
    pesoTonLoteProcesada?: number;

    @IsOptional()
    @IsNumber()
    canalesObtenidas?: number;

    @IsOptional()
    @IsNumber()
    diferencialAvesEntrega?: number;
}