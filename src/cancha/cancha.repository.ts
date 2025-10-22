import { Repository } from '../shared/repository.js'
import { Cancha } from './cancha.entity.js'

const canchas: Cancha[] = [
    { id_cancha: 1, nombre: "Cancha 1", estado: "disponible" },
    { id_cancha: 2, nombre: "Cancha 2", estado: "ocupada" },
    { id_cancha: 3, nombre: "Cancha 3", estado: "mantenimiento" }
];

export class CanchaRepository implements Repository<Cancha> {
    public findAll(): Cancha[] {
        return canchas;
    }

    public findOne(item: { id: number }): Cancha | undefined {
        return canchas.find(c => c.id_cancha === item.id);
    }

    public add(item: Cancha): Cancha {
        canchas.push(item);
        return item;
    }

    public update(item: Cancha): Cancha | undefined {
        const canchaIdx = canchas.findIndex((cancha) => cancha.id_cancha === item.id_cancha);
        if (canchaIdx === -1) {
            return undefined;
        }
        canchas[canchaIdx] = { ...canchas[canchaIdx], ...item };
        return canchas[canchaIdx];  
    }

    public delete(item: { id: number }): Cancha | undefined {
        const canchaIdx = canchas.findIndex((cancha) => cancha.id_cancha === item.id);
        if (canchaIdx === -1) {
            return undefined;
        }
        const deletedCancha = canchas[canchaIdx];
        canchas.splice(canchaIdx, 1);
        return deletedCancha;
    }
}