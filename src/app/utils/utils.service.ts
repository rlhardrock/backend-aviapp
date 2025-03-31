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

     paginateList(page: number = 1, limit: number = 10) {
        const take = Math.max(1, limit); // Evitar valores negativos o 0
        const skip = (Math.max(1, page) - 1) * take;
        return { take, skip };
      }
}
