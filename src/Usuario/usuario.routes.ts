import { Router } from 'express'
import { sanitizeUsuarioInput, findAll, findOne, findByDni, findByEmail, add, update, remove } from './usuario.controller.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.get('/dni/:dni', findByDni)
usuarioRouter.get('/email/:email', findByEmail)
usuarioRouter.post('/', sanitizeUsuarioInput, add)
usuarioRouter.put('/:id', sanitizeUsuarioInput, update)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update)
usuarioRouter.delete('/:id', remove)