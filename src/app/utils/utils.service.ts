import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

@Injectable()
export class UtilsService {
    
    // Función para capitalizar la primera letra de cada palabra
    capitalizeFirstLetter(str: string): string {
        return str
          .split(' ') // Divide el texto en palabras
          .map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Convierte a mayúscula la primera letra y el resto a minúsculas
        )
        .join(' '); // Vuelve a unir las palabras
    }
  
    // Función para formatear el número de identificación con puntos
    formatIdentification(id: string): string {
        const match = id.match(/^(CC|CE|PP|NIT)?/i);
        let prefix = match?.[0]?.toUpperCase() || 'CC';
        const digitsOnly = id.replace(/[^\d]/g, '');
        if (digitsOnly.length === 0) {
          throw new Error('Identificación inválida: no contiene dígitos.');
        }
        const formattedDigits = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${prefix}-${formattedDigits}`;
    }

    // Formatear número telefónico a un formato legible internacional
    /* formatPhoneNumber(phoneNumber: string, country: string = 'CO'): string {
        const phone = parsePhoneNumberFromString(phoneNumber, country as CountryCode);
        if (phone && phone.isValid()) {
        return phone.formatInternational(); // Retorna el formato internacional
        }
        throw new Error('Número telefónico inválido');
    } */

    formatPhoneNumber(phoneNumber: string): string {
        if (typeof phoneNumber !== 'string') {
            throw new BadRequestException('El número de teléfono debe ser una cadena de texto.');
        }
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        if (cleanNumber.length !== 10) {
            throw new BadRequestException('El número telefónico debe contener exactamente 10 dígitos numéricos.');
        }
        if (!cleanNumber.startsWith('3')) {
            throw new BadRequestException('El número debe ser un móvil colombiano (iniciar por 3).');
        }
        const formatted =
            cleanNumber.slice(0, 3) + '-' +
            cleanNumber.slice(3, 4) + '-' +
            cleanNumber.slice(4, 6) + '-' +
            cleanNumber.slice(6, 8) + '-' +
            cleanNumber.slice(8);
        return formatted;
    }
        
    formatString(input: string): string {
        // Convertir la cadena a mayúsculas
        let formatted = input.toUpperCase();
        // Reemplazar los espacios por guiones
        formatted = formatted.replace(/\s+/g, '-');
        // Añadir un guion entre los grupos de letras y números
        formatted = formatted.replace(/([a-zA-Z]+)(\d+)/g, '$1-$2');
        formatted = formatted.replace(/(\d+)([a-zA-Z]+)/g, '$1-$2');
        return formatted;
    }

    formatNIT(nitRaw: string): string {
        const cleaned = nitRaw.replace(/\D/g, '');
        if (cleaned.length < 10) {
          throw new Error('El NIT debe contener al menos 10 dígitos.');
        }
        const base = cleaned.slice(0, -1);
        const checkDigit = cleaned.slice(-1);
        return `NIT-${base}-${checkDigit}`;
    }

    /* paginateList(page?: number, limit?: number) {
        const safePage = Number.isNaN(Number(page)) || page < 1 ? 1 : Number(page);
        const safeLimit = Number.isNaN(Number(limit)) || limit < 1 ? 10 : Number(limit);
        return { take: safeLimit, skip: (safePage - 1) * safeLimit };
    } */

    paginateList(page: number, limit: number) {
        const take = limit;
        const skip = (page - 1) * take;
        return { take, skip };
    }

    validateUUID(id: string): boolean {
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return regex.test(id);
    }

    caseInsensitiveContains(value: string): Prisma.StringFilter {
        return {
          contains: value,
          mode: 'insensitive',
        };
    }

}
