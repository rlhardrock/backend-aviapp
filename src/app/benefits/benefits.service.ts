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
    private utils: UtilsService,
    private benefitsFormulas: BenefitsFormulasService,
  ) {}
 
  // Crear un nuevo benefit
  async create(createBenefitDto: CreateBenefitDto) {
    return this.prisma.benefit.create({
      data: {
        tpSupervisorPlanta: this.utils.formatString(createBenefitDto.tpSupervisorPlanta),
        idSupervisorPlanta: this.utils.formatIdentification(createBenefitDto.idSupervisorPlanta),
        nombreSupervisorPlanta: this.utils.capitalizeFirstLetter(createBenefitDto.nombreSupervisorPlanta),
        apellidoSupervisorPlanta: this.utils.capitalizeFirstLetter(createBenefitDto.apellidoSupervisorPlanta),
        tpProfesionalPlanta: this.utils.formatString(createBenefitDto.tpProfesionalPlanta),
        idProfesionalPlanta: this.utils.formatIdentification(createBenefitDto.idProfesionalPlanta),
        nombreProfesionalPlanta: this.utils.capitalizeFirstLetter(createBenefitDto.nombreProfesionalPlanta),
        apellidoProfesionalPlanta: this.utils.capitalizeFirstLetter(createBenefitDto.apellidoProfesionalPlanta),
        placa: this.utils.formatString(createBenefitDto.placa),
        idConductor: this.utils.formatIdentification(createBenefitDto.idConductor),
        nombreConductor: this.utils.capitalizeFirstLetter(createBenefitDto.nombreConductor),
        apellidoConductor: this.utils.capitalizeFirstLetter(createBenefitDto.apellidoConductor),
        idRemision: this.utils.formatString(createBenefitDto.idRemision),
        idEmpresa: this.utils.formatString(createBenefitDto.idEmpresa),
        idPlanSanitario: this.utils.formatString(createBenefitDto.idPlanSanitario),
        regionProcedencia: this.utils.capitalizeFirstLetter(createBenefitDto.regionProcedencia),
        granja: this.utils.capitalizeFirstLetter(createBenefitDto.granja),
        galpon: this.utils.formatString(createBenefitDto.galpon),
        lineaAves: this.utils.capitalizeFirstLetter(createBenefitDto.lineaAves),
        sexo: this.utils.capitalizeFirstLetter(createBenefitDto.sexo),
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
        pesoPromedioAvePlanta: this.benefitsFormulas.calculatePesoAvePlanta(createBenefitDto.pesoTorre7Guacales, createBenefitDto.peso1GuacalVacio, createBenefitDto.avesPorGuacal),
        diferencialPesoGranjaPlanta: this.benefitsFormulas.calculateDiferencialPesoIndividual(createBenefitDto.pesoPromedioAveGranja, createBenefitDto.pesoPromedioAvePlanta),
        pesoTonLoteProcesada: this.benefitsFormulas.calculatePesoTonelajeLotePlanta(createBenefitDto.pesoPromedioAvePlanta, createBenefitDto.avesColgadas),
        canalesObtenidas: this.benefitsFormulas.calculateCanalesEntregarDelLote(createBenefitDto.avesColgadas, createBenefitDto.canalesDecomisadas),
        diferencialAvesEntrega: this.benefitsFormulas.calculateEntregaDelLote(createBenefitDto.avesRemisionadas, createBenefitDto.avesColgadas, createBenefitDto.avesAsfixiadas),
        canalesEnDeuda: this.benefitsFormulas.calculateCanalesEnDeuda(createBenefitDto.avesRemisionadas, createBenefitDto.avesColgadas, createBenefitDto.avesAsfixiadas, createBenefitDto.canalesDecomisadas),
      }
    });
  }

  // listar todo los benefits
  async findAll(page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [benefits, total] = await Promise.all([
      this.prisma.benefit.findMany({ take, skip }),
      this.prisma.benefit.count()
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      benefits
    };
  }

  // listar todos los beneficios por idPlanSanitario
  async findAllByIdPlanSanitario(idPlanSanitario: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [benefits, total] = await Promise.all([
      this.prisma.benefit.findMany({ take, skip, where: { idPlanSanitario } }),
      this.prisma.benefit.count({ where: { idPlanSanitario } })
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      benefits
    };
  }

  // listar todos los beneficios por idEmpresa
  async findAllByIdEmpresa(idEmpresa: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [benefits, total] = await Promise.all([
      this.prisma.benefit.findMany({ take, skip, where: { idEmpresa } }),
      this.prisma.benefit.count({ where: { idEmpresa } })
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      benefits
    };
  }

  // listar todos los beneficios por tpProfesionalPlanta
  async findAllByTpProfesionalPlanta(tpProfesionalPlanta: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [benefits, total] = await Promise.all([
      this.prisma.benefit.findMany({ take, skip, where: { tpProfesionalPlanta } }),
      this.prisma.benefit.count({ where: { tpProfesionalPlanta } })
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      benefits
    };
  }
  
  // listar todos los benefits por placa
  async findAllByPlaca(placa: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [benefits, total] = await Promise.all([
      this.prisma.benefit.findMany({ take, skip, where: { placa } }),
      this.prisma.benefit.count({ where: { placa } })
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      benefits
    };
  }

  // listar todos los benefits por idConductor
  async findAllByIdConductor(idConductor: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [benefits, total] = await Promise.all([
      this.prisma.benefit.findMany({ take, skip, where: { idConductor } }),
      this.prisma.benefit.count({ where: { idConductor } })
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      benefits
    };
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
        tpSupervisorPlanta: this.utils.formatString(updateBenefitDto.tpSupervisorPlanta),
        idSupervisorPlanta: this.utils.formatIdentification(updateBenefitDto.idSupervisorPlanta),
        nombreSupervisorPlanta: this.utils.capitalizeFirstLetter(updateBenefitDto.nombreSupervisorPlanta),
        apellidoSupervisorPlanta: this.utils.capitalizeFirstLetter(updateBenefitDto.apellidoSupervisorPlanta),
        tpProfesionalPlanta: this.utils.formatString(updateBenefitDto.tpProfesionalPlanta),
        idProfesionalPlanta: this.utils.formatIdentification(updateBenefitDto.idProfesionalPlanta),
        nombreProfesionalPlanta: this.utils.capitalizeFirstLetter(updateBenefitDto.nombreProfesionalPlanta),
        apellidoProfesionalPlanta: this.utils.capitalizeFirstLetter(updateBenefitDto.apellidoProfesionalPlanta),
        placa: this.utils.formatString(updateBenefitDto.placa),
        idConductor: this.utils.formatIdentification(updateBenefitDto.idConductor),
        nombreConductor: this.utils.capitalizeFirstLetter(updateBenefitDto.nombreConductor),
        apellidoConductor: this.utils.capitalizeFirstLetter(updateBenefitDto.apellidoConductor),
        idRemision: this.utils.formatString(updateBenefitDto.idRemision),
        idEmpresa: this.utils.formatString(updateBenefitDto.idEmpresa),
        idPlanSanitario: this.utils.formatString(updateBenefitDto.idPlanSanitario),
        regionProcedencia: this.utils.capitalizeFirstLetter(updateBenefitDto.regionProcedencia),
        granja: this.utils.capitalizeFirstLetter(updateBenefitDto.granja),
        galpon: this.utils.formatString(updateBenefitDto.galpon),
        lineaAves: this.utils.capitalizeFirstLetter(updateBenefitDto.lineaAves),
        sexo: this.utils.capitalizeFirstLetter(updateBenefitDto.sexo),
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
        pesoPromedioAvePlanta: this.benefitsFormulas.calculatePesoAvePlanta(updateBenefitDto.pesoTorre7Guacales, updateBenefitDto.peso1GuacalVacio, updateBenefitDto.avesPorGuacal),
        diferencialPesoGranjaPlanta: this.benefitsFormulas.calculateDiferencialPesoIndividual(updateBenefitDto.pesoPromedioAveGranja, updateBenefitDto.pesoPromedioAvePlanta),
        pesoTonLoteProcesada: this.benefitsFormulas.calculatePesoTonelajeLotePlanta(updateBenefitDto.pesoPromedioAvePlanta, updateBenefitDto.avesColgadas),
        canalesObtenidas: this.benefitsFormulas.calculateCanalesEntregarDelLote(updateBenefitDto.avesColgadas, updateBenefitDto.canalesDecomisadas),
        diferencialAvesEntrega: this.benefitsFormulas.calculateEntregaDelLote(updateBenefitDto.avesRemisionadas, updateBenefitDto.avesColgadas, updateBenefitDto.avesAsfixiadas),
        canalesEnDeuda: this.benefitsFormulas.calculateCanalesEnDeuda(updateBenefitDto.avesRemisionadas, updateBenefitDto.avesColgadas, updateBenefitDto.avesAsfixiadas, updateBenefitDto.canalesDecomisadas),
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
