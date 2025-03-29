import { Prisma } from '@prisma/client';
import { map } from 'rxjs';

export class Benefit {
    
  public  id:                          number;
  
  public  tpSupervisorPlanta:           string;
  public  idSupervisorPlanta:           string;
  public  nombreSupervisorPlanta:       string;
  public  apellidoSupervisorPlanta:     string;
  
  public  tpProfesionalPlanta:          string;
  public  idProfesionalPlanta:          string;
  public  nombreProfesionalPlanta:      string;
  public  apellidoProfesionalPlanta:    string;

  /* public  tpInspectorSanitario:         string;
  public  idInspectorSanitario:         string;
  public  nombreInspectorSanitario:     string;
  public  apellidoInspectorSanitario:   string; */

  /* public  tpProfesionalGranja:          string;
  public  idProfesionalGranja:          string;
  public  nombreProfesionalGranja:      string;
  public  apellidoProfesionalGranja:    string; */

  public  placa:                        string;
  public  idConductor:                  string;
  public  nombreConductor:              string;
  public  apellidoConductor:            string;

  public  idRemision:                   string;
  public  idEmpresa:                    string;
  public  idPlanSanitario:              string;
  public  regionProcedencia:            string;
  public  granja:                       string;
  public  galpon:                       string;
  public  lineaAves:                    string;
  public  sexo:                         string;
  public  edad:                         number;
  public  horaBeneficio:                Date;
  public  turnoBeneficio:               number;

  public  pesoPromedioAveGranja:        number;
  public  avesPorGuacal:                number;
  public  guacalesVacios:               number;
  public  guacalesUsados:               number;
  public  guacalExtra:                  number;
  public  avesRemisionadas:             number;
  public  avesEnGuacalExtra:            number;

  public  avesColgadas:                 number;
  public  avesAsfixiadas:               number;
  public  canalesDecomisadas:           number;
  public  canalesDestrozadas:           number;

  public  peso1GuacalVacio:             number;
  public  pesoTorre7Guacales:           number;
  public  pesoPromedioAvePlanta:        number;
  
  public  diferencialPesoGranjaPlanta:  number;
  public  pesoTonLoteProcesada:         number;
  public  canalesObtenidas:             number;
  public  diferencialAvesEntrega:       number;

  public  createdAt: Date;
  public  updatedAt: Date;

  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

}
