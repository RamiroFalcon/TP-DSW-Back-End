import { Router } from 'express'
import { sanitizeTipoCanchaInput, findAll, findOne, add, update, remove } from './tipo-cancha.controller.js'

export const tipoCanchaRouter = Router()

tipoCanchaRouter.get('/', findAll)
tipoCanchaRouter.get('/:id', findOne)
tipoCanchaRouter.post('/', sanitizeTipoCanchaInput, add)
tipoCanchaRouter.put('/:id', sanitizeTipoCanchaInput, update)
tipoCanchaRouter.patch('/:id', sanitizeTipoCanchaInput, update)
tipoCanchaRouter.delete('/:id', remove)