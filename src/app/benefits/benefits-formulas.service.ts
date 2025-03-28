import { Injectable } from '@nestjs/common';

@Injectable()
export class BenefitsFormulasService {
    
    calculatePesoAvePlanta(pesoTorre7Guacales: number, peso1GuacalVacio: number, avesPorGuacal: number): number {
        return ( pesoTorre7Guacales - (peso1GuacalVacio * 7) )/ (avesPorGuacal * 7);
      }
    
    calculateDiferencialPesoIndividual(pesoPromedioAveGranja: number, pesoPromedioAvePlanta: number): number {
        return pesoPromedioAveGranja - pesoPromedioAvePlanta;
    }
    
    calculatePesoTonelajeLotePlanta(pesoPromedioAvePlanta: number, avesColgadas: number): number {
        return (pesoPromedioAvePlanta * avesColgadas) / 1000000;
    }
    
    calculateCanalesEntregarDelLote(avesColgadas: number, canalesDecomisadas: number): number {
        return avesColgadas - canalesDecomisadas;
    }
    
    calculateEntregaDelLote(avesRemisionadas: number, avesColgadas: number, avesAsfixiadas: number): number {
        return avesRemisionadas - avesColgadas - avesAsfixiadas;
    }

    calculateCanalesEnDeuda(avesRemisionadas: number, avesColgadas: number, avesAsfixiadas: number, canalesDecomisadas: number): number {
        return this.calculateEntregaDelLote(avesRemisionadas, avesColgadas, avesAsfixiadas) - canalesDecomisadas;
    }
}
