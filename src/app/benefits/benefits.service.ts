import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    try {
      if (!createBenefitDto || Object.keys(createBenefitDto).length === 0) {
        throw new BadRequestException('El objeto de creación no puede estar vacío.');
      }
      const existingBenefit = await this.prisma.benefit.findUnique({ 
        where: { idRemision: createBenefitDto.idRemision }
      });
      if (existingBenefit) {
        throw new ConflictException(`Ya existe un beneficio con idRemision: ${createBenefitDto.idRemision}`);
      }
      const newBenefit = await this.prisma.benefit.create({
        data: {
          licenseSupBef: this.utils.formatString(createBenefitDto.licenseSupBef),
          license: this.utils.formatString(createBenefitDto.license),
          placa: this.utils.formatString(createBenefitDto.placa),
          business: this.utils.formatString(createBenefitDto.business),
          taxpayer: this.utils.formatString(createBenefitDto.taxpayer),
          idRemision: this.utils.formatString(createBenefitDto.idRemision),
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
          canalesEnDeuda: this.benefitsFormulas.calculateCanalesEnDeuda(
            createBenefitDto.avesRemisionadas,
            createBenefitDto.avesColgadas,
            createBenefitDto.avesAsfixiadas,
            createBenefitDto.canalesDecomisadas
          ),
        },
      });
      return newBenefit;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el beneficio: ${error.message || 'Error desconocido'}`
      );
    }
  }

  // listar todo los benefits
  async findAll(page: number, limit: number) {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new BadRequestException('El número de página debe ser un entero positivo.');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('El límite debe ser un entero positivo mayor a 0.');
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.benefit.count(),
      ]);
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener los beneficios: ${error.message || 'Error desconocido'}`,
      );
    }
  }

  // listar todos los beneficios por idPlanSanitario
  async findAllByIdPlanSanitario(idPlanSanitario: string, page: number, limit: number) {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new BadRequestException('El número de página debe ser un entero positivo.');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('El límite debe ser un entero positivo mayor a 0.');
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({
          take,
          skip,
          where: {
            idPlanSanitario:{
              contains: idPlanSanitario.trim(),
              mode: 'insensitive'
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.benefit.count({ where: { idPlanSanitario } }),
      ]);
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener los beneficios por idPlanSanitario: ${error.message || 'Error desconocido'}`,
      );
    }
  }

  // listar todos los beneficios por idEmpresa
  async findAllByIdEmpresa(business: string, page: number, limit: number) {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new BadRequestException('El número de página debe ser un entero positivo.');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('El límite debe ser un entero positivo mayor a 0.');
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({
          take,
          skip,
          where: { 
            business:{
              contains: business.trim(),
              mode: 'insensitive'
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.benefit.count({ where: { business } }),
      ]);
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener los beneficios por idEmpresa: ${error.message || 'Error desconocido'}`,
      );
    }
  }

  // listar todos los beneficios por tpProfesionalPlanta
  async findAllByTpProfesionalPlanta(license: string, page: number, limit: number) {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new BadRequestException('El número de página debe ser un entero positivo.');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('El límite debe ser un entero positivo mayor a 0.');
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({
          take,
          skip,
          where: { 
            license:{
              contains: license.trim(),
              mode: 'insensitive'
            },
          },
          orderBy: { license: 'asc' },
        }),
        this.prisma.benefit.count({ where: { license } }),
      ]);
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener los beneficios por tpProfesionalPlanta: ${error.message || 'Error desconocido'}`,
      );
    }
  }

  // listar todos los benefits por placa
  async findAllByPlaca(plate: string, page: number, limit: number) {
    try {
      if (!plate || typeof plate !== 'string' || plate.trim().length === 0) {
        throw new BadRequestException('La placa no puede estar vacía.');
      }
      if (!Number.isInteger(page) || page < 1) {
        throw new BadRequestException('El número de página debe ser un entero positivo.');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('El límite debe ser un entero positivo mayor a 0.');
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({
          take,
          skip,
          where: { 
            plate: {
              contains: plate.trim(),
              mode: 'insensitive',
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.benefit.count({ where: { plate } }),
      ]);
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener los beneficios por placa: ${error.message || 'Error desconocido'}`,
      );
    }
  }

  // listar todos los benefits por idConductor
  async findAllByIdConductor(taxpayer: string, page: number, limit: number) {
    try {
      if (!taxpayer || typeof taxpayer !== 'string') {
        throw new BadRequestException('El ID del conductor es inválido.');
      }
      if (!Number.isInteger(page) || page < 1) {
        throw new BadRequestException('El número de página debe ser un entero positivo.');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('El límite debe ser un entero positivo mayor a 0.');
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [benefits, total] = await Promise.all([
        this.prisma.benefit.findMany({
          take,
          skip,
          where: { 
            taxpayer: {
              contains: taxpayer.trim(),
              mode: 'insensitive',
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.benefit.count({ where: { taxpayer } }),
      ]);
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        benefits,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener los beneficios por conductor: ${error.message || 'Error desconocido'}`,
      );
    }
  }

  // Encontrar un benefit por ID  
  async findOne(id: string) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException('Formato UUID invalido');
      }
      const benefit = await this.prisma.benefit.findUnique({
        where: { id },
      });
      if (!benefit) {
        throw new NotFoundException(`No se encontró un beneficio con ID: ${id}`);
      }
      return benefit;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el beneficio: ${error.message || 'Error desconocido'}`,
      );
    }
  }

  // Encontar un benefit por idRemision
  async findOneByIdRemision(idRemision: string) {
    try {
      if (!idRemision || typeof idRemision !== 'string') {
        throw new BadRequestException('El ID de remisión proporcionado es inválido.');
      }
      const benefit = await this.prisma.benefit.findUnique({
        where: { 
          idRemision: {
            contains: idRemision.trim(),
            mode: 'insensitive',
          },
        },
      });
      if (!benefit) {
        throw new NotFoundException(`No se encontró un beneficio con idRemision: ${idRemision}`);
      }
      return benefit;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el beneficio por idRemision: ${error.message || 'Error desconocido'}`,
      );
    }
  }

  // Actualizar un benefit
  async update(id: string, updateBenefitDto: UpdateBenefitDto) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException('Formato UUID invalido');
      }
      if (!updateBenefitDto || Object.keys(updateBenefitDto).length === 0) {
        throw new BadRequestException('El objeto de actualización no puede estar vacío.');
      }
      const existingBenefit = await this.prisma.benefit.findUnique({ where: { id } });
      if (!existingBenefit) {
        throw new NotFoundException(`No se encontró un beneficio con ID: ${id}`);
      }
      const updatedBenefit = await this.prisma.benefit.update({
        where: { id },
        data: {
          licenseSupBef: this.utils.formatString(updateBenefitDto.licenseSupBef),
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
          canalesEnDeuda: this.benefitsFormulas.calculateCanalesEnDeuda(updateBenefitDto.avesRemisionadas, updateBenefitDto.avesColgadas, updateBenefitDto.avesAsfixiadas, updateBenefitDto.canalesDecomisadas),
        }
      });
      return updatedBenefit;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el beneficio: ${error.message || 'Error desconocido'}`,
      );
    }
  }
  
  // Eliminar un benefit
  async remove(id: string) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException('Formato UUID invalido');
      }
      const existingBenefit = await this.prisma.benefit.findUnique({
        where: { id },
      });
      if (!existingBenefit) {
        throw new NotFoundException(`No se encontró un beneficio con el ID: ${id}`);
      }
      return await this.prisma.benefit.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error; // Re-lanza excepciones esperadas
      }
      throw new InternalServerErrorException(
        `Error al eliminar el beneficio: ${error.message || 'Error desconocido'}`,
      );
    }
  }
}
