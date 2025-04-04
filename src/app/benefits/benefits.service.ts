import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { BenefitsFormulasService } from './benefits-formulas.service';
import { PaginationDto } from '../utils/pagination.dto';

@Injectable()
export class BenefitsService {

  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
    private benefitsFormulas: BenefitsFormulasService,
  ) {}
 
  // Crear un nuevo benefit
  async create(createBenefitDto: CreateBenefitDto) {
    try {
      const normalizedRemision = this.utils.formatString(createBenefitDto.idRemision);
      const benefit = await this.prisma.benefit.findFirst({ where: { idRemision: { contains: normalizedRemision.trim(),  mode: 'insensitive' }}});
      if (benefit) {
        throw new ConflictException(`Ya existe un beneficio con ID Remision: ${createBenefitDto.idRemision}`);
      }
      const newBenefit = await this.prisma.benefit.create({
        data: {
          licenseSup: this.utils.formatString(createBenefitDto.licenseSup),
          license: this.utils.formatString(createBenefitDto.license),
          placa: this.utils.formatString(createBenefitDto.placa),
          business: this.utils.formatString(createBenefitDto.business),
          taxpayer: this.utils.formatString(createBenefitDto.taxpayer),
          idRemision: normalizedRemision,
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
          pesoPromedioAvePlanta: this.benefitsFormulas.calculatePesoAvePlanta(
            createBenefitDto.pesoTorre7Guacales,
            createBenefitDto.peso1GuacalVacio,
            createBenefitDto.avesPorGuacal
          ),
          diferencialPesoGranjaPlanta: this.benefitsFormulas.calculateDiferencialPesoIndividual(
            createBenefitDto.pesoPromedioAveGranja,
            createBenefitDto.pesoPromedioAvePlanta
          ),
          pesoTonLoteProcesada: this.benefitsFormulas.calculatePesoTonelajeLotePlanta(
            createBenefitDto.pesoPromedioAvePlanta,
            createBenefitDto.avesColgadas
          ),
          canalesObtenidas: this.benefitsFormulas.calculateCanalesEntregarDelLote(
            createBenefitDto.avesColgadas,
            createBenefitDto.canalesDecomisadas
          ),
          diferencialAvesEntrega: this.benefitsFormulas.calculateEntregaDelLote(
            createBenefitDto.avesRemisionadas,
            createBenefitDto.avesColgadas,
            createBenefitDto.avesAsfixiadas
          ),
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Beneficio creado con exito.',
        data: newBenefit,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al crear el beneficio.');
    }
  }

  // listar todo los benefits
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({ take, skip, orderBy: { createdAt: 'asc' } }),
        this.prisma.benefit.count(),
      ]);
      if (total === 0) {
        throw new NotFoundException('No se encontraron beneficios');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de todos los beneficios',
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // listar todos los beneficios por idPlanSanitario
  async findAllByIdPlanSanitario(idPlanSanitario: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const idPlanSanitarioFilter = { contains: idPlanSanitario.trim(), mode: 'insensitive' };
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({ where: { idPlanSanitario: idPlanSanitarioFilter }, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.benefit.count({ where: { idPlanSanitario: idPlanSanitarioFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron beneficios con el plan sanitario ID ${idPlanSanitario}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de Beneficios con el plan sanitario ID ${idPlanSanitario}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // listar todos los beneficios por idEmpresa
  async findAllByIdEmpresa(business: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const businessFilter = { contains: business.trim(), mode: 'insensitive' };
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({ where: { business: businessFilter }, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.benefit.count({ where: { business: businessFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron beneficios de la empresa ID ${business}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de Beneficios de la empresa ID ${business}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // listar todos los beneficios por Supervisor de Planta (Huesped)
  async findAllByTpSupervisorPlanta(licenseSup: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const licenseSupFilter = { contains: licenseSup.trim(), mode: 'insensitive' };
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({ where: { licenseSup: licenseSupFilter }, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.benefit.count({ where: { licenseSup: licenseSupFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron beneficios con el supervisor de planta ID ${licenseSup}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de Beneficios con el supervisor de planta ID ${licenseSup}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
       
  // listar todos los beneficios por Profesional Planta (Invitado)
  async findAllByTpProfesionalPlanta(license: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const licenseFilter = { contains: license.trim(), mode: 'insensitive' };
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({ where: { license: licenseFilter }, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.benefit.count({ where: { license: licenseFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron beneficios asociados al profesional auditor ${license}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de Beneficios con el profesional auditor ${license}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // listar todos los benefits por placa
  async findAllByPlaca(plate: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const plateFilter = { contains: plate.trim(), mode: 'insensitive' };
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({ where: { plate: plateFilter }, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.benefit.count({ where: { plate: plateFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron camiones con la placa: ${plate}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de Beneficios con camiones con la placa ${plate}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // listar todos los benefits por idConductor
  async findAllByIdConductor(taxpayer: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const taxpayerFilter = { contains: taxpayer.trim(), mode: 'insensitive' };
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({ where: { taxpayer: taxpayerFilter }, take, skip, orderBy: { lastName: 'asc' } }),
        this.prisma.benefit.count({ where: { taxpayer: taxpayerFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron beneficios asociados al conductor ${taxpayer}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de Beneficios con conductores ${taxpayer}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encontrar un benefit por ID  
  async findOne(id: string) {
    try {
      const benefit = await this.prisma.benefit.findUnique({ where: { id } });
      if (!benefit) {
        throw new NotFoundException(`Beneficio con ID ${id} no encontrado.`);
      }
      return benefit;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encontar un benefit por idRemision
  async findOneByIdRemision(idRemision: string) {
    try {
      const normalizedRemision = this.utils.formatString(idRemision);
      const benefit = await this.prisma.benefit.findFirst({ where: { idRemision: { contains: normalizedRemision.trim(),  mode: 'insensitive' }}});
      if (!benefit) {
        throw new NotFoundException(`Beneficio con ID ${idRemision} no encontrado.`);
      }
      return benefit;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
    
  // Actualizar un benefit
  async update(id: string, updateBenefitDto: UpdateBenefitDto) {
    try {
      const existingBenefit = await this.prisma.benefit.findUnique({ where: { id } });
      if (!existingBenefit) {
        throw new HttpException('Beneficio no encontrado', HttpStatus.NOT_FOUND);
      }
      const updatedBenefit = await this.prisma.benefit.update({
        where: { id },
        data: {
          licenseSup: this.utils.formatString(updateBenefitDto.licenseSup),
          license: this.utils.formatString(updateBenefitDto.license),
          placa: this.utils.formatString(updateBenefitDto.placa),
          business: this.utils.formatString(updateBenefitDto.business),
          taxpayer: this.utils.formatString(updateBenefitDto.taxpayer),
          idRemision: this.utils.formatString(updateBenefitDto.idRemision),
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
        }
      });
      return { message: 'Beneficio actualizado satisfactoriamente', data: updatedBenefit };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`El beneficio con ID ${id} no fue encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
  
  // Eliminar un benefit
  async remove(id: string) {
    try {
      await this.prisma.benefit.delete({ where: { id } });
      return { message: `Beneficio con ID ${id} eliminado exitosamente` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`El beneficio con ID ${id} no fue encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
}