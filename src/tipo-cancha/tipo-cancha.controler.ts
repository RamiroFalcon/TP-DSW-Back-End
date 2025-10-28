
import { Request, Response, NextFunction } from 'express'
import { TipoCanchaRepository } from './tipo-cancha.repository.js'
import { TipoCancha } from './tipo-cancha.entity.js'

const repository = new TipoCanchaRepository()

type SanitizedTipoCanchaInput = Partial<TipoCancha>

function sanitizeTipoCanchaInput(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).send({ message: 'El body es requerido' })
    }

    const sanitizedInput: SanitizedTipoCanchaInput = {}

    if (req.body.id_tipo_cancha) {
        const id = Number(req.body.id_tipo_cancha)
        if (isNaN(id)) {
            return res.status(400).send({ message: 'El id_tipo_cancha debe ser un número' })
        }
        sanitizedInput.id_tipo_cancha = id
    }

    if (req.body.nombre) {
        const nombre = req.body.nombre.trim()
        if (nombre.length === 0) {
            return res.status(400).send({ message: 'El nombre no puede estar vacío' })
        }
        sanitizedInput.nombre = nombre
    }

    if (req.body.deporte) {
        const deporte = req.body.deporte.trim()
        if (deporte.length === 0) {
            return res.status(400).send({ message: 'El deporte no puede estar vacío' })
        }
        sanitizedInput.deporte = deporte
    }

    req.body.sanitizedInput = sanitizedInput
    next()
}

async function findAll(req: Request, res: Response) {
    const tiposCanchas = await repository.findAll()
    res.json({ data: tiposCanchas })
}

async function findOne(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const tipoCancha = await repository.findOne({ id })
    if (!tipoCancha) {
        return res.status(404).send({ message: 'Tipo de cancha no encontrado' })
    }

    res.json({ data: tipoCancha })
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput as SanitizedTipoCanchaInput

    if (!input.nombre || !input.deporte) {
        return res.status(400).send({ message: 'nombre y deporte son requeridos' })
    }

    const tipoCancha = new TipoCancha(0, input.nombre, input.deporte)
    const tipoCanchaCreado = await repository.add(tipoCancha)

    if (!tipoCanchaCreado) {
        return res.status(500).send({ message: 'Error al crear tipo de cancha' })
    }

    return res.status(201).send({ message: 'Tipo de cancha creado', data: tipoCanchaCreado })
}

async function update(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const input = req.body.sanitizedInput as SanitizedTipoCanchaInput
    input.id_tipo_cancha = id

    const tipoCancha = await repository.update(input as TipoCancha)

    if (!tipoCancha) {
        return res.status(404).send({ message: 'Tipo de cancha no encontrado' })
    }

    return res.status(200).send({ message: 'Tipo de cancha actualizado', data: tipoCancha })
}

async function remove(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const tipoCancha = await repository.delete({ id })

    if (!tipoCancha) {
        return res.status(404).send({ message: 'Tipo de cancha no encontrado' })
    }

    return res.status(200).send({ message: 'Tipo de cancha eliminado', data: tipoCancha })
}

export { sanitizeTipoCanchaInput, findAll, findOne, add, update, remove }