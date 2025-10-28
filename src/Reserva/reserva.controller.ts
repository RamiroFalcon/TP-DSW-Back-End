import { Request, Response, NextFunction } from 'express'
import { ReservaRepository } from './reserva.repository.js'
import { Reserva } from './reserva.entity.js'

const repository = new ReservaRepository()

type SanitizedReservaInput = Partial<Reserva>

function sanitizeReservaInput(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).send({ message: 'El body es requerido' })
    }

    const sanitizedInput: SanitizedReservaInput = {}

    if (req.body.id_reserva) {
        const id = Number(req.body.id_reserva)
        if (isNaN(id)) {
            return res.status(400).send({ message: 'El id_reserva debe ser un número' })
        }
        sanitizedInput.id_reserva = id
    }

    if (req.body.id_cancha) {
        const id = Number(req.body.id_cancha)
        if (isNaN(id)) {
            return res.status(400).send({ message: 'El id_cancha debe ser un número' })
        }
        sanitizedInput.id_cancha = id
    }

    if (req.body.id_cliente) {
        const id = Number(req.body.id_cliente)
        if (isNaN(id)) {
            return res.status(400).send({ message: 'El id_cliente debe ser un número' })
        }
        sanitizedInput.id_cliente = id
    }

    if (req.body.fecha) {
        sanitizedInput.fecha = req.body.fecha.trim()
    }

    if (req.body.hora_ini) {
        sanitizedInput.hora_ini = req.body.hora_ini.trim()
    }

    if (req.body.hora_fin) {
        sanitizedInput.hora_fin = req.body.hora_fin.trim()
    }

    if (req.body.estado) {
        sanitizedInput.estado = req.body.estado.trim()
    }

    req.body.sanitizedInput = sanitizedInput
    next()
}

async function findAll(req: Request, res: Response) {
    const reservas = await repository.findAll()
    res.json({ data: reservas })
}

async function findOne(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const reserva = await repository.findOne({ id })
    if (!reserva) {
        return res.status(404).send({ message: 'Reserva no encontrada' })
    }

    res.json({ data: reserva })
}

async function findByCancha(req: Request, res: Response) {
    const id_cancha = Number(req.params.id_cancha)
    if (isNaN(id_cancha)) {
        return res.status(400).send({ message: 'id_cancha inválido' })
    }

    const reservas = await repository.findByCancha(id_cancha)
    res.json({ data: reservas })
}

async function findByCliente(req: Request, res: Response) {
    const id_cliente = Number(req.params.id_cliente)
    if (isNaN(id_cliente)) {
        return res.status(400).send({ message: 'id_cliente inválido' })
    }

    const reservas = await repository.findByCliente(id_cliente)
    res.json({ data: reservas })
}

async function findByFecha(req: Request, res: Response) {
    const fecha = req.params.fecha
    const reservas = await repository.findByFecha(fecha)
    res.json({ data: reservas })
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput as SanitizedReservaInput

    if (!input.id_cancha || !input.id_cliente || !input.fecha || !input.hora_ini || !input.hora_fin || !input.estado) {
        return res.status(400).send({ 
            message: 'id_cancha, id_cliente, fecha, hora_ini, hora_fin y estado son requeridos' 
        })
    }

    const disponible = await repository.verificarDisponibilidad(
        input.id_cancha,
        input.fecha,
        input.hora_ini,
        input.hora_fin
    )

    if (!disponible) {
        return res.status(409).send({ 
            message: 'La cancha no está disponible en el horario seleccionado' 
        })
    }

    const reserva = new Reserva(
        0,
        input.id_cancha,
        input.id_cliente,
        input.fecha,
        input.hora_ini,
        input.hora_fin,
        input.estado
    )
    const reservaCreada = await repository.add(reserva)

    if (!reservaCreada) {
        return res.status(500).send({ message: 'Error al crear reserva' })
    }

    return res.status(201).send({ message: 'Reserva creada', data: reservaCreada })
}

async function update(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const input = req.body.sanitizedInput as SanitizedReservaInput
    
    const reservaToUpdate = {
        id_reserva: id,
        ...(input.id_cancha !== undefined && { id_cancha: input.id_cancha }),
        ...(input.id_cliente !== undefined && { id_cliente: input.id_cliente }),
        ...(input.fecha !== undefined && { fecha: input.fecha }),
        ...(input.hora_ini !== undefined && { hora_ini: input.hora_ini }),
        ...(input.hora_fin !== undefined && { hora_fin: input.hora_fin }),
        ...(input.estado !== undefined && { estado: input.estado })
    } as Reserva

    const reserva = await repository.update(reservaToUpdate)

    if (!reserva) {
        return res.status(404).send({ message: 'Reserva no encontrada' })
    }

    return res.status(200).send({ message: 'Reserva actualizada', data: reserva })
}

async function remove(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const reserva = await repository.delete({ id })

    if (!reserva) {
        return res.status(404).send({ message: 'Reserva no encontrada' })
    }

    return res.status(200).send({ message: 'Reserva eliminada' })
}

export { sanitizeReservaInput, findAll, findOne, findByCancha, findByCliente, findByFecha, add, update, remove }