import { Injectable } from '@nestjs/common';
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
    // Elimina los puntos si el ID tiene alguno
        let cleanedId = id.replace(/\./g, '');
    // Aplica la expresión regular para insertar puntos cada 3 dígitos
        return cleanedId.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

        // Formatear número telefónico a un formato legible internacional
    formatPhoneNumber(phoneNumber: string, country: string = 'CO'): string {
        const phone = parsePhoneNumberFromString(phoneNumber, country as CountryCode);
        if (phone && phone.isValid()) {
        return phone.formatInternational(); // Retorna el formato internacional
        }
        throw new Error('Número telefónico inválido');
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
}
