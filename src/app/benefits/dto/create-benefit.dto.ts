import { IsDate, IsNumber, IsString } from "class-validator/types/decorator/decorators";

export class CreateBenefitDto {

    @IsString()
    tpSupervisorPlanta:           string;

    @IsString()
    idSupervisorPlanta:           string;

    @IsString()
    nombreSupervisorPlanta:       string;

    @IsString()
    apellidoSupervisorPlanta:     string;
  
    @IsString()
    tpProfesionalPlanta:          string;

    @IsString()
    idProfesionalPlanta:          string;

    @IsString()
    nombreProfesionalPlanta:      string;

    @IsString()
    apellidoProfesionalPlanta:    string;

    @IsString()
    tpInspectorSanitario:         string;

    @IsString()
    idInspectorSanitario:         string;

    @IsString()
    nombreInspectorSanitario:     string;

    @IsString()
    apellidoInspectorSanitario:   string;

    @IsString()
    tpProfesionalGranja:          string;

    @IsString()
    idProfesionalGranja:          string;

    @IsString()
    nombreProfesionalGranja:      string;

    @IsString()
    apellidoProfesionalGranja:    string;

    @IsString()
    placa:                        string;

    @IsString()
    idConductor:                  string;

    @IsString()
    nombreConductor:              string;

    @IsString()
    apellidoConductor:            string;

    @IsString()
    idRemision:                   string;

    @IsString()
    idEmpresa:                    string;

    @IsString()
    idPlanSanitario:              string;

    @IsString()
    regionProcedencia:            string;

    @IsString()
    granja:                       string;

    @IsString()
    galpon:                       string;

    @IsString()
    lineaAves:                    string;

    @IsString()
    sexo:                         string;

    @IsNumber()
    edad:                         number;

    @IsDate()
    horaBeneficio:                Date;

    @IsNumber()
    turnoBeneficio:               number;

    @IsNumber()
    pesoPromedioAveGranja:        number;

    @IsNumber()
    avesPorGuacal:                number;

    @IsNumber()
    guacalesVacios:               number;

    @IsNumber()
    guacalesUsados:               number;

    @IsNumber()
    guacalExtra:                  number;

    @IsNumber()
    avesRemisionadas:             number;

    @IsNumber()
    avesEnGuacalExtra:            number;

    @IsNumber()
    avesColgadas:                 number;

    @IsNumber()
    avesAsfixiadas:               number;

    @IsNumber()
    canalesDecomisadas:              number;

    @IsNumber()
    canalesDestrozadas:              number;

    @IsNumber()
    peso1GuacalVacio:             number;

    @IsNumber()
    pesoTorre7Guacales:           number;

    @IsNumber()
    pesoPromedioAvePlanta:        number;

}
