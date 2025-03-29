import { Injectable } from '@nestjs/common';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { BenefitsFormulasService } from './benefits-formulas.service';

@Injectable()
export class BenefitsService {

  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
    private benefitsFormulasService: BenefitsFormulasService,
  ) {}
 
  // Crear un nuevo benefit
  async create(createBenefitDto: CreateBenefitDto) {
    return this.prisma.benefit.create({
      data: {
        tpSupervisorPlanta: this.utilsService.formatString(createBenefitDto.tpSupervisorPlanta),
        idSupervisorPlanta: this.utilsService.formatIdentification(createBenefitDto.idSupervisorPlanta),
        nombreSupervisorPlanta: this.utilsService.capitalizeFirstLetter(createBenefitDto.nombreSupervisorPlanta),
        apellidoSupervisorPlanta: this.utilsService.capitalizeFirstLetter(createBenefitDto.apellidoSupervisorPlanta),
        tpProfesionalPlanta: this.utilsService.formatString(createBenefitDto.tpProfesionalPlanta),
        idProfesionalPlanta: this.utilsService.formatIdentification(createBenefitDto.idProfesionalPlanta),
        nombreProfesionalPlanta: this.utilsService.capitalizeFirstLetter(createBenefitDto.nombreProfesionalPlanta),
        apellidoProfesionalPlanta: this.utilsService.capitalizeFirstLetter(createBenefitDto.apellidoProfesionalPlanta),
        placa: this.utilsService.formatString(createBenefitDto.placa),
        idConductor: this.utilsService.formatIdentification(createBenefitDto.idConductor),
        nombreConductor: this.utilsService.capitalizeFirstLetter(createBenefitDto.nombreConductor),
        apellidoConductor: this.utilsService.capitalizeFirstLetter(createBenefitDto.apellidoConductor),
        idRemision: this.utilsService.formatString(createBenefitDto.idRemision),
        idEmpresa: this.utilsService.formatString(createBenefitDto.idEmpresa),
        idPlanSanitario: this.utilsService.formatString(createBenefitDto.idPlanSanitario),
        regionProcedencia: this.utilsService.capitalizeFirstLetter(createBenefitDto.regionProcedencia),
        granja: this.utilsService.capitalizeFirstLetter(createBenefitDto.granja),
        galpon: this.utilsService.formatString(createBenefitDto.galpon),
        lineaAves: this.utilsService.capitalizeFirstLetter(createBenefitDto.lineaAves),
        sexo: this.utilsService.capitalizeFirstLetter(createBenefitDto.sexo),
        edad: createBenefitDto.edad,
        horaBeneficio: createBenefitDto.horaBeneficio,
        turnoBeneficio: createBenefitDto.turnoBeneficio,
        pesoPromedioAveGranja: createBenefitDto.pesoPromedioAveGranja,
        avesPorGuacal: createBenefitDto.avesPorGuacal,
        guacalesVacios: createBenefitDto.guacalesVacios,
        guacalesUsados: createBenefitDto.guacalesUsados,
        guacalExtra: createBenefitDto.guacalExtra,
        avesRemisionadas: createBenefitDto.avesRemisionadas,
        avesEnGuacalExtra: createBenefitDto.avesEnGuacalExtra,
        avesColgadas: createBenefitDto.avesColgadas,
        avesAsfixiadas: createBenefitDto.avesAsfixiadas,
        canalesDecomisadas: createBenefitDto.canalesDecomisadas,
        canalesDestrozadas: createBenefitDto.canalesDestrozadas,
        peso1GuacalVacio: createBenefitDto.peso1GuacalVacio,
        pesoTorre7Guacales: createBenefitDto.pesoTorre7Guacales,
        pesoPromedioAvePlanta: this.benefitsFormulasService.calculatePesoAvePlanta(createBenefitDto.pesoTorre7Guacales, createBenefitDto.peso1GuacalVacio, createBenefitDto.avesPorGuacal),
        diferencialPesoGranjaPlanta: this.benefitsFormulasService.calculateDiferencialPesoIndividual(createBenefitDto.pesoPromedioAveGranja, createBenefitDto.pesoPromedioAvePlanta),
        pesoTonLoteProcesada: this.benefitsFormulasService.calculatePesoTonelajeLotePlanta(createBenefitDto.pesoPromedioAvePlanta, createBenefitDto.avesColgadas),
        canalesObtenidas: this.benefitsFormulasService.calculateCanalesEntregarDelLote(createBenefitDto.avesColgadas, createBenefitDto.canalesDecomisadas),
        diferencialAvesEntrega: this.benefitsFormulasService.calculateEntregaDelLote(createBenefitDto.avesRemisionadas, createBenefitDto.avesColgadas, createBenefitDto.avesAsfixiadas),
        canalesEnDeuda: this.benefitsFormulasService.calculateCanalesEnDeuda(createBenefitDto.avesRemisionadas, createBenefitDto.avesColgadas, createBenefitDto.avesAsfixiadas, createBenefitDto.canalesDecomisadas),
      }
    });
  }

  // listar todo los benefits
  findAll() {
    return this.prisma.benefit.findMany();
  }

  // listar todos los beneficios por idPlanSanitario
  findAllByIdPlanSanitario(idPlanSanitario: string) {
    return this.prisma.benefit.findMany({
      where: { idPlanSanitario },
    });
  }

  // listar todos los beneficios por idEmpresa
  findAllByIdEmpresa(idEmpresa: string) {
    return this.prisma.benefit.findMany({
      where: { idEmpresa },
    });
  }

  // listar todos los beneficios por tpProfesionalPlanta
  findAllByTpProfesionalPlanta(tpProfesionalPlanta: string) {
    return this.prisma.benefit.findMany({
      where: { tpProfesionalPlanta },
    });
  }
  
  // listar todos los benefits por placa
  findAllByPlaca(placa: string) {
    return this.prisma.benefit.findMany({
      where: { placa },
    });
  }

  // listar todos los benefits por idConductor
  findAllByIdConductor(idConductor: string) {
    return this.prisma.benefit.findMany({
      where: { idConductor },
    });
  }

  // Encontrar un benefit por ID  
  findOne(id: number) {
    return this.prisma.benefit.findUnique({
      where: { id },
    });
  }

  // Encontar un benefit por idRemision
  findOneByIdRemision(idRemision: string) {
    return this.prisma.benefit.findUnique({
      where: { idRemision },
    });
  }

  // Actualizar un benefit
  update(id: number, updateBenefitDto: UpdateBenefitDto) {
    return this.prisma.benefit.update({
      where: { id },
      data: {
        tpSupervisorPlanta: this.utilsService.formatString(updateBenefitDto.tpSupervisorPlanta),
        idSupervisorPlanta: this.utilsService.formatIdentification(updateBenefitDto.idSupervisorPlanta),
        nombreSupervisorPlanta: this.utilsService.capitalizeFirstLetter(updateBenefitDto.nombreSupervisorPlanta),
        apellidoSupervisorPlanta: this.utilsService.capitalizeFirstLetter(updateBenefitDto.apellidoSupervisorPlanta),
        tpProfesionalPlanta: this.utilsService.formatString(updateBenefitDto.tpProfesionalPlanta),
        idProfesionalPlanta: this.utilsService.formatIdentification(updateBenefitDto.idProfesionalPlanta),
        nombreProfesionalPlanta: this.utilsService.capitalizeFirstLetter(updateBenefitDto.nombreProfesionalPlanta),
        apellidoProfesionalPlanta: this.utilsService.capitalizeFirstLetter(updateBenefitDto.apellidoProfesionalPlanta),
        placa: this.utilsService.formatString(updateBenefitDto.placa),
        idConductor: this.utilsService.formatIdentification(updateBenefitDto.idConductor),
        nombreConductor: this.utilsService.capitalizeFirstLetter(updateBenefitDto.nombreConductor),
        apellidoConductor: this.utilsService.capitalizeFirstLetter(updateBenefitDto.apellidoConductor),
        idRemision: this.utilsService.formatString(updateBenefitDto.idRemision),
        idEmpresa: this.utilsService.formatString(updateBenefitDto.idEmpresa),
        idPlanSanitario: this.utilsService.formatString(updateBenefitDto.idPlanSanitario),
        regionProcedencia: this.utilsService.capitalizeFirstLetter(updateBenefitDto.regionProcedencia),
        granja: this.utilsService.capitalizeFirstLetter(updateBenefitDto.granja),
        galpon: this.utilsService.formatString(updateBenefitDto.galpon),
        lineaAves: this.utilsService.capitalizeFirstLetter(updateBenefitDto.lineaAves),
        sexo: this.utilsService.capitalizeFirstLetter(updateBenefitDto.sexo),
        edad: updateBenefitDto.edad,
        horaBeneficio: updateBenefitDto.horaBeneficio,
        turnoBeneficio: updateBenefitDto.turnoBeneficio,
        pesoPromedioAveGranja: updateBenefitDto.pesoPromedioAveGranja,
        avesPorGuacal: updateBenefitDto.avesPorGuacal,
        guacalesVacios: updateBenefitDto.guacalesVacios,
        guacalesUsados: updateBenefitDto.guacalesUsados,
        guacalExtra: updateBenefitDto.guacalExtra,
        avesRemisionadas: updateBenefitDto.avesRemisionadas,
        avesEnGuacalExtra: updateBenefitDto.avesEnGuacalExtra,
        avesColgadas: updateBenefitDto.avesColgadas,
        avesAsfixiadas: updateBenefitDto.avesAsfixiadas,
        canalesDecomisadas: updateBenefitDto.canalesDecomisadas,
        canalesDestrozadas: updateBenefitDto.canalesDestrozadas,
        peso1GuacalVacio: updateBenefitDto.peso1GuacalVacio,
        pesoTorre7Guacales: updateBenefitDto.pesoTorre7Guacales,
        pesoPromedioAvePlanta: this.benefitsFormulasService.calculatePesoAvePlanta(updateBenefitDto.pesoTorre7Guacales, updateBenefitDto.peso1GuacalVacio, updateBenefitDto.avesPorGuacal),
        diferencialPesoGranjaPlanta: this.benefitsFormulasService.calculateDiferencialPesoIndividual(updateBenefitDto.pesoPromedioAveGranja, updateBenefitDto.pesoPromedioAvePlanta),
        pesoTonLoteProcesada: this.benefitsFormulasService.calculatePesoTonelajeLotePlanta(updateBenefitDto.pesoPromedioAvePlanta, updateBenefitDto.avesColgadas),
        canalesObtenidas: this.benefitsFormulasService.calculateCanalesEntregarDelLote(updateBenefitDto.avesColgadas, updateBenefitDto.canalesDecomisadas),
        diferencialAvesEntrega: this.benefitsFormulasService.calculateEntregaDelLote(updateBenefitDto.avesRemisionadas, updateBenefitDto.avesColgadas, updateBenefitDto.avesAsfixiadas),
        canalesEnDeuda: this.benefitsFormulasService.calculateCanalesEnDeuda(updateBenefitDto.avesRemisionadas, updateBenefitDto.avesColgadas, updateBenefitDto.avesAsfixiadas, updateBenefitDto.canalesDecomisadas),
      }
    });
  }

  // Eliminar un benefit
  remove(id: number) {
    return this.prisma.benefit.delete({
      where: { id },
    });
  }
}
