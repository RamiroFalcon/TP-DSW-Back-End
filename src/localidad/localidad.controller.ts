import { Request, Response, NextFunction } from 'express'
import { LocalidadRepository } from './localidad.repository.js'
import { Localidad } from './localidad.entity.js'

const repository = new LocalidadRepository()

type SanitizedLocalidadInput = Partial<Localidad>

function sanitizeLocalidadInput(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).send({ message: 'El body es requerido' })
    }

    const sanitizedInput: SanitizedLocalidadInput = {}

    if (req.body.id_localidad) {
        const id = Number(req.body.id_localidad)
        if (isNaN(id)) {
            return res.status(400).send({ message: 'El id_localidad debe ser un número' })
        }
        sanitizedInput.id_localidad = id
    }

    if (req.body.nombre) {
        const nombre = req.body.nombre.trim()
        if (nombre.length === 0) {
            return res.status(400).send({ message: 'El nombre no puede estar vacío' })
        }
        sanitizedInput.nombre = nombre
    }

    req.body.sanitizedInput = sanitizedInput
    next()
}

async function findAll(req: Request, res: Response) {
    const localidades = await repository.findAll()
    res.json({ data: localidades })
}

async function findOne(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const localidad = await repository.findOne({ id })
    if (!localidad) {
        return res.status(404).send({ message: 'Localidad no encontrada' })
    }

    res.json({ data: localidad })
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput as SanitizedLocalidadInput

    if (!input.nombre) {
        return res.status(400).send({ message: 'nombre es requerido' })
    }

    const localidad = new Localidad(0, input.nombre)
    const localidadCreada = await repository.add(localidad)

    if (!localidadCreada) {
        return res.status(500).send({ message: 'Error al crear localidad' })
    }

    return res.status(201).send({ message: 'Localidad creada', data: localidadCreada })
}

async function update(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const input = req.body.sanitizedInput as SanitizedLocalidadInput
    
    const localidadToUpdate = {
        id_localidad: id,
        ...(input.nombre !== undefined && { nombre: input.nombre })
    } as Localidad

    const localidad = await repository.update(localidadToUpdate)

    if (!localidad) {
        return res.status(404).send({ message: 'Localidad no encontrada' })
    }

    return res.status(200).send({ message: 'Localidad actualizada', data: localidad })
}

async function remove(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    try {
        const localidad = await repository.delete({ id })

        if (!localidad) {
            return res.status(404).send({ message: 'Localidad no encontrada' })
        }

        return res.status(200).send({ message: 'Localidad eliminada', data: localidad })
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send({ 
                message: 'No se puede eliminar la localidad porque hay clientes asociados a ella',
                error: 'Elimina primero los clientes asociados o asígnalos a otra localidad'
            })
        }
        return res.status(500).send({ message: 'Error al eliminar localidad', error: error.message })
    }
}

export { sanitizeLocalidadInput, findAll, findOne, add, update, remove }