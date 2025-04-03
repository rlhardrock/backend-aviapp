import { IsDate, IsNumber, IsString, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateBenefitDto {
    @IsString()
    @IsNotEmpty()
    licenseSupBef: string;

    @IsString()
    @IsNotEmpty()
    license: string;

    @IsString()
    @IsNotEmpty()
    placa: string;

    @IsString()
    @IsNotEmpty()
    business: string;

    @IsString()
    @IsNotEmpty()
    taxpayer: string;

    @IsString()
    @IsNotEmpty()
    idRemision: string;

    @IsString()
    @IsNotEmpty()
    idPlanSanitario: string;

    @IsString()
    @IsNotEmpty()
    regionProcedencia: string;

    @IsString()
    @IsNotEmpty()
    granja: string;

    @IsString()
    @IsNotEmpty()
    galpon: string;

    @IsString()
    @IsNotEmpty()
    lineaAves: string;

    @IsString()
    @IsNotEmpty()
    sexo: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    edad: number;

    @IsDate()
    @IsNotEmpty()
    horaBeneficio: Date;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    turnoBeneficio: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    pesoPromedioAveGranja: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    avesPorGuacal: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    guacalesVacios: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    guacalesUsados: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    guacalExtra: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    avesRemisionadas: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    avesEnGuacalExtra: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    avesColgadas: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    avesAsfixiadas: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    canalesDecomisadas: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    canalesDestrozadas: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    peso1GuacalVacio: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    pesoTorre7Guacales: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    pesoPromedioAvePlanta: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    diferencialPesoGranjaPlanta: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    pesoTonLoteProcesada: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    canalesObtenidas: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    diferencialAvesEntrega: number;
}