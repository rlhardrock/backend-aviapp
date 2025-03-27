import { Prisma } from '@prisma/client';

export class Benefit {
    public id: number;
    public idRemision: string;
    public idEmpresa: string;
    public regionProcedencia: string;
    public granja: string;
    public galpon: string;
    public lineaAves: string;
    public sexo: string;
    public edad: number;
    public pesoPromedioAveGranja: number;
    public placaVehiculo: string;
    public idConductor: string;
    public nombreConductor: string;
    public idPlanSanitario: string;
    public tpProfesionalGranja: string;
    public nombreProfesional: string;
    public tpProfesionalPlanta: string;
    public nombreAuditor: string;
    public horaBeneficio: Date;
    public avesPorGuacal: number;
    public guacalesVacios: number;
    public guacalesUsados: number;
    public guacalExtra: number;
    public avesRemisionadas: number;
    public avesEnGuacalExtra: number;
    public avesColgadas: number;
    public avesAsfixiadas: number;
    public avesDecomisadas: number;
    public avesDestrozadas: number;
    public peso1GuacalVacio: number;
    public pesoTorre7Guacales: number;
    public pesoPromedioAvePlanta: number;
    public diferencialPesoGranjaPlanta: number;
    public pesoTonLoteProcesada: number;
    public canalesObtenidas: number;
    public diferencialAvesEntrega: number;
    public createdAt?: Date;
    public updatedAt?: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
