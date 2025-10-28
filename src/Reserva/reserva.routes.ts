import { Router } from 'express'
import { sanitizeReservaInput, findAll, findOne, findByCancha, findByCliente, findByFecha, add, update, remove } from './reserva.controller.js'

export const reservaRouter = Router()

reservaRouter.get('/', findAll)
reservaRouter.get('/:id', findOne)
reservaRouter.get('/cancha/:id_cancha', findByCancha)
reservaRouter.get('/cliente/:id_cliente', findByCliente)
reservaRouter.get('/fecha/:fecha', findByFecha)
reservaRouter.post('/', sanitizeReservaInput, add)
reservaRouter.put('/:id', sanitizeReservaInput, update)
reservaRouter.patch('/:id', sanitizeReservaInput, update)
reservaRouter.delete('/:id', remove)