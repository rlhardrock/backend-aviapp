import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  getErrorMessage(code: string, params?: Record<string, any>): string {
    const messages = {
      USER_NOT_FOUND: 'El usuario no fue encontrado.',
      INVALID_PAGE: 'El número de página debe ser un entero positivo.',
      INTERNAL_ERROR: 'Ha ocurrido un error inesperado.',
      COMPANY_UPDATE_FAILED: 'Ha ocurrido un error al actualizar la empresa.',
    };

    let message = messages[code] || messages.INTERNAL_ERROR;
    // Reemplazar variables en el mensaje (ejemplo: 'Usuario {id} no encontrado')
    if (params) {
      Object.keys(params).forEach(key => {
        message = message.replace(`{${key}}`, params[key]);
      });
    }
    return message;
  }
}