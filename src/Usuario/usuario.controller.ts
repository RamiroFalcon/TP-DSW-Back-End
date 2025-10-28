import { Request, Response, NextFunction } from 'express'
import { UsuarioRepository } from './usuario.repository.js'
import { Usuario } from './usuario.entity.js'

const repository = new UsuarioRepository()

type SanitizedUsuarioInput = Partial<Usuario>

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).send({ message: 'El body es requerido' })
    }

    const sanitizedInput: SanitizedUsuarioInput = {}

    if (req.body.id_usuario) {
        const id = Number(req.body.id_usuario)
        if (isNaN(id)) {
            return res.status(400).send({ message: 'El id_usuario debe ser un número' })
        }
        sanitizedInput.id_usuario = id
    }

    if (req.body.nombre) {
        const nombre = req.body.nombre.trim()
        if (nombre.length === 0) {
            return res.status(400).send({ message: 'El nombre no puede estar vacío' })
        }
        sanitizedInput.nombre = nombre
    }

    if (req.body.apellido) {
        const apellido = req.body.apellido.trim()
        if (apellido.length === 0) {
            return res.status(400).send({ message: 'El apellido no puede estar vacío' })
        }
        sanitizedInput.apellido = apellido
    }

    if (req.body.dni) {
        const dni = req.body.dni.trim()
        if (dni.length === 0) {
            return res.status(400).send({ message: 'El DNI no puede estar vacío' })
        }
        sanitizedInput.dni = dni
    }

    if (req.body.telefono) {
        const telefono = req.body.telefono.trim()
        sanitizedInput.telefono = telefono
    }

    if (req.body.email) {
        const email = req.body.email.trim()
        if (email.length === 0) {
            return res.status(400).send({ message: 'El email no puede estar vacío' })
        }
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: 'El email no es válido' })
        }
        sanitizedInput.email = email
    }

    req.body.sanitizedInput = sanitizedInput
    next()
}

async function findAll(req: Request, res: Response) {
    const usuarios = await repository.findAll()
    res.json({ data: usuarios })
}

async function findOne(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const usuario = await repository.findOne({ id })
    if (!usuario) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    res.json({ data: usuario })
}

async function findByDni(req: Request, res: Response) {
    const dni = req.params.dni
    const usuario = await repository.findByDni(dni)
    
    if (!usuario) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    res.json({ data: usuario })
}

async function findByEmail(req: Request, res: Response) {
    const email = req.params.email
    const usuario = await repository.findByEmail(email)
    
    if (!usuario) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    res.json({ data: usuario })
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput as SanitizedUsuarioInput

    if (!input.nombre || !input.apellido || !input.dni || !input.telefono || !input.email) {
        return res.status(400).send({ message: 'nombre, apellido, dni, telefono y email son requeridos' })
    }

    // Verificar que el DNI no exista
    const usuarioExistente = await repository.findByDni(input.dni)
    if (usuarioExistente) {
        return res.status(409).send({ message: 'Ya existe un usuario con ese DNI' })
    }

    // Verificar que el email no exista
    const emailExistente = await repository.findByEmail(input.email)
    if (emailExistente) {
        return res.status(409).send({ message: 'Ya existe un usuario con ese email' })
    }

    const usuario = new Usuario(0, input.nombre, input.apellido, input.dni, input.telefono, input.email)
    const usuarioCreado = await repository.add(usuario)

    if (!usuarioCreado) {
        return res.status(500).send({ message: 'Error al crear usuario' })
    }

    return res.status(201).send({ message: 'Usuario creado', data: usuarioCreado })
}

async function update(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    const input = req.body.sanitizedInput as SanitizedUsuarioInput
    
    const usuarioToUpdate = {
        id_usuario: id,
        ...(input.nombre !== undefined && { nombre: input.nombre }),
        ...(input.apellido !== undefined && { apellido: input.apellido }),
        ...(input.dni !== undefined && { dni: input.dni }),
        ...(input.telefono !== undefined && { telefono: input.telefono }),
        ...(input.email !== undefined && { email: input.email })
    } as Usuario

    const usuario = await repository.update(usuarioToUpdate)

    if (!usuario) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    return res.status(200).send({ message: 'Usuario actualizado', data: usuario })
}

async function remove(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).send({ message: 'id inválido' })
    }

    try {
        const usuario = await repository.delete({ id })

        if (!usuario) {
            return res.status(404).send({ message: 'Usuario no encontrado' })
        }

        return res.status(200).send({ message: 'Usuario eliminado', data: usuario })
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send({ 
                message: 'No se puede eliminar el usuario porque tiene datos asociados',
                error: 'Elimina primero los registros asociados al usuario'
            })
        }
        return res.status(500).send({ message: 'Error al eliminar usuario', error: error.message })
    }
}

export { sanitizeUsuarioInput, findAll, findOne, findByDni, findByEmail, add, update, remove }