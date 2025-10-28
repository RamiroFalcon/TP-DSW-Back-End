import { Request, Response, NextFunction } from 'express'
import { CanchaRepository } from './cancha.repository.js'
import { Cancha } from './cancha.entity.js'

const repository = new CanchaRepository()

type SanitizedCanchaInput = Partial<Cancha>

function sanitizeCanchaInput(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).send({ message: 'El body es requerido' })
    }

    const sanitizedInput: SanitizedCanchaInput = {}

    if (req.body.id_cancha) {
        const id = Number(req.body.id_cancha)
        if (isNaN(id)) {
            return res.status(400).send({ message: 'El id_cancha debe ser un número' })
        }
        sanitizedInput.id_cancha = id
    }

    if (req.body.nombre) {
        const nombre = req.body.nombre.trim()
        if (nombre.length === 0) {
            return res.status(400).send({ message: 'El nombre no puede estar vacío' })
        }
        sanitizedInput.nombre = nombre
    }

    if (req.body.estado) {
        const estado = req.body.estado.trim().toLowerCase()
        const estadosValidos = ['disponible', 'reservada', 'mantenimiento']
        
        if (!estadosValidos.includes(estado)) {
            return res.status(400).send({
                message: 'Estado inválido. Debe ser: disponible, reservada o mantenimiento'
            })
        }
        sanitizedInput.estado = estado as 'disponible' | 'reservada' | 'mantenimiento'
    }

    if (req.body.id_tipo_cancha) {
        const idTipo = Number(req.body.id_tipo_cancha)
        if (isNaN(idTipo)) {
            return res.status(400).send({ message: 'El id_tipo_cancha debe ser un número' })
        }
        sanitizedInput.id_tipo_cancha = idTipo
    }

    req.body.sanitizedInput = sanitizedInput
    next()
}
async function findAll(req: Request, res: Response) {
    const canchas = await repository.findAll()
    res.json({ data: canchas })
}

async function findOne(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const cancha = await repository.findOne({ id })
    if (!cancha) {
        return res.status(404).send({ message: 'Cancha no encontrada' })
    }

    res.json({ data: cancha })
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput as SanitizedCanchaInput

    if (!input.nombre || !input.estado || !input.id_tipo_cancha) {
        return res.status(400).send({ message: 'nombre, estado y id_tipo_cancha son requeridos' })
    }

    const cancha = new Cancha(0, input.nombre, input.estado, input.id_tipo_cancha)
    const canchaCreada = await repository.add(cancha)

    if (!canchaCreada) {
        return res.status(500).send({ message: 'Error al crear cancha' })
    }

    return res.status(201).send({ message: 'Cancha creada', data: canchaCreada })
}

async function update(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const input = req.body.sanitizedInput as SanitizedCanchaInput
    
    const canchaToUpdate = {
        id_cancha: id,
        ...(input.nombre !== undefined && { nombre: input.nombre }),
        ...(input.estado !== undefined && { estado: input.estado }),
        ...(input.id_tipo_cancha !== undefined && { id_tipo_cancha: input.id_tipo_cancha })
    } as Cancha

    const cancha = await repository.update(canchaToUpdate)

    if (!cancha) {
        return res.status(404).send({ message: 'Cancha no encontrada' })
    }

    return res.status(200).send({ message: 'Cancha actualizada', data: cancha })
}

async function remove(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    try {
        const cancha = await repository.delete({ id })

        if (!cancha) {
            return res.status(404).send({ message: 'Cancha no encontrada' })
        }

        return res.status(200).send({ message: 'Cancha eliminada', data: cancha })
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send({ 
                message: 'No se puede eliminar la cancha porque tiene reservas asociadas',
                error: 'Elimina primero las reservas asociadas'
            })
        }
        return res.status(500).send({ message: 'Error al eliminar cancha', error: error.message })
    }
}

export { sanitizeCanchaInput, findAll, findOne, add, update, remove }