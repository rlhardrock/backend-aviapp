import { Company } from 'src/app/companies/entities/company.entity';
import { Professional } from 'src/app/professionals/entities/professional.entity';
import { Transporter } from 'src/app/transporters/entities/transporter.entity';
import { Truck } from 'src/app/trucks/entities/truck.entity';
import { User } from 'src/app/users/entities/user.entity';

export class Benefit {
    
  public  id:                          string;
  
  public  licenseSup:                  string;
  public  license:                     string;
  public  plate:                       string;
  public  business:                    string;
  public  taxpayer:                    string;

  public  idRemision:                  string;
  public  idPlanSanitario:             string;
  public  regionProcedencia:           string;
  public  granja:                      string;
  public  galpon:                      string;
  public  lineaAves:                   string;
  public  sexo:                        string;
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

  // Relations
  public  transporter: Transporter;
  public  company: Company;
  public  truck: Truck;
  public  professional: Professional;
  public  user: User;

  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

}
