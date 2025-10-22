import { Request, Response, NextFunction } from 'express'
import { CanchaRepository } from './cancha.repository.js'
import { Cancha } from './cancha.entity.js'

const repository = new CanchaRepository()

type SanitizedCanchaInput = Partial<Cancha>

function sanitizeCanchaInput(req: Request, res: Response, next: NextFunction) {
    // 1. Verificar que el body existe
    if (!req.body) {
        return res.status(400).send({ message: 'El body es requerido' });
    }

    // 2. Crear objeto con los datos básicos
    const sanitizedInput: SanitizedCanchaInput = {};

    // 3. Validar y sanitizar id_cancha si existe
    if (req.body.id_cancha) {
        const id = Number(req.body.id_cancha);
        if (isNaN(id)) {
            return res.status(400).send({ message: 'El id_cancha debe ser un número' });
        }
        sanitizedInput.id_cancha = id;
    }

    // 4. Validar y sanitizar nombre si existe
    if (req.body.nombre) {
        const nombre = req.body.nombre.trim();
        if (nombre.length === 0) {
            return res.status(400).send({ message: 'El nombre no puede estar vacío' });
        }
        sanitizedInput.nombre = nombre;
    }

    // 5. Validar y sanitizar estado si existe
    if (req.body.estado) {
        const estado = req.body.estado.toLowerCase();
        const estadosValidos = ['disponible', 'ocupada', 'mantenimiento'];
        
        if (!estadosValidos.includes(estado)) {
            return res.status(400).send({ 
                message: 'Estado inválido. Debe ser: disponible, ocupada o mantenimiento' 
            });
        }
        sanitizedInput.estado = estado;
    }

    // 6. Guardar datos sanitizados en el request
    req.body.sanitizedInput = sanitizedInput;
    next();
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).send({ message: 'id invalido' })
  }

  const cancha = repository.findOne({ id })
  if (!cancha) {
    return res.status(404).send({ message: 'Cancha not found' })
  }

  res.json({ data: cancha })
}

function add(req: Request, res: Response) {
  const input = (req.body as { sanitizedInput?: SanitizedCanchaInput }).sanitizedInput ?? {}

  if (input.id_cancha === undefined || !input.nombre || !input.estado) {
    return res.status(400).send({ message: 'Faltan datos de la cancha (id_cancha, nombre, estado)' })
  }

  const canchaInput = new Cancha(input.id_cancha, input.nombre, input.estado)
  const cancha = repository.add(canchaInput)

  return res.status(201).send({ message: 'Cancha creada', data: cancha })
}

function update(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        return res.status(400).send({ message: 'id invalido' })
    }

    const input = (req.body as { sanitizedInput?: SanitizedCanchaInput }).sanitizedInput ?? {}
    input.id_cancha = id  

    const cancha = repository.update(input as Cancha)

    if (!cancha) {
        return res.status(404).send({ message: 'Cancha not found' })
    }

    return res.status(200).send({ message: 'Cancha actualizada', data: cancha })
}

function remove(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).send({ message: 'id invalido' })
  }

  const cancha = repository.delete({ id })

  if (!cancha) {
    return res.status(404).send({ message: 'Cancha not found' })
  }

  return res.status(200).send({ message: 'Cancha eliminada' })
}

export { sanitizeCanchaInput, findAll, findOne, add, update, remove }
