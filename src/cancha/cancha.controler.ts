import { Request, Response, NextFunction } from 'express'
import { CanchaRepository } from './cancha.repository.js'
import { Cancha } from './cancha.entity.js'

const repository = new CanchaRepository()

type SanitizedCanchaInput = Partial<Cancha>

function sanitizeCanchaInput(req: Request, res: Response, next: NextFunction) {
  const sanitizedInput: SanitizedCanchaInput = {
    id_cancha:
      req.body.id_cancha !== undefined ? Number(req.body.id_cancha) : undefined,
    nombre:
      typeof req.body.nombre === 'string' ? req.body.nombre.trim() : undefined,
    estado:
      typeof req.body.estado === 'string'
        ? req.body.estado.toLowerCase()
        : undefined,
  }

  // Podés sumar validaciones extra acá (ej.: estados permitidos, nombre no vacío, etc.)

  Object.keys(sanitizedInput).forEach((key) => {
    const k = key as keyof SanitizedCanchaInput
    if (sanitizedInput[k] === undefined || sanitizedInput[k] === '') {
      delete sanitizedInput[k]
    }
  })

  req.body.sanitizedInput = sanitizedInput
  next()
}

async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() })
}

async function findOne(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).send({ message: 'id invalido' })
  }

  const cancha = await repository.findOne({ id })
  if (!cancha) {
    return res.status(404).send({ message: 'Cancha not found' })
  }

  res.json({ data: cancha })
}

async function add(req: Request, res: Response) {
  const input = (req.body as { sanitizedInput?: SanitizedCanchaInput })
    .sanitizedInput

  if (!input || input.id_cancha === undefined || !input.nombre || !input.estado) {
    return res.status(400).send({
      message: 'Faltan datos de la cancha (id_cancha, nombre, estado)',
    })
  }

  const canchaInput = new Cancha(input.id_cancha, input.nombre, input.estado)
  const cancha = await repository.add(canchaInput)

  return res.status(201).send({ message: 'Cancha creada', data: cancha })
}

async function update(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).send({ message: 'id invalido' })
  }

  const input = (req.body as { sanitizedInput?: SanitizedCanchaInput })
    .sanitizedInput ?? {}

  const existing = await repository.findOne({ id })
  if (!existing) {
    return res.status(404).send({ message: 'Cancha not found' })
  }

  const canchaActualizada = new Cancha(
    id,
    input.nombre ?? existing.nombre,
    (input.estado ?? existing.estado) as Cancha['estado']
  )

  const cancha = await repository.update(canchaActualizada)
  return res
    .status(200)
    .send({ message: 'Cancha actualizada correctamente', data: cancha })
}

async function remove(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).send({ message: 'id invalido' })
  }

  const cancha = await repository.delete({ id })
  if (!cancha) {
    return res.status(404).send({ message: 'Cancha not found' })
  }

  res.status(200).send({ message: 'Cancha eliminada correctamente' })
}

export { sanitizeCanchaInput, findAll, findOne, add, update, remove }
