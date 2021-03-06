import express from 'express'

import { isAuthenticated } from '../middlewares/authentication'
import {
  createEvent,
  findAllEvents,
  findEventById,
  requestToJoin,
  findEventParticipants,
  findRequestedEvents,
  findParticipatingEvents,
  findEventsByCreator,
  updateEvent,
  deleteEvent
} from '../controllers/event'

const router = express.Router()

router.post('/', isAuthenticated, createEvent)
router.post('/:eventId/request', isAuthenticated, requestToJoin)
router.get('/', findAllEvents)
router.get('/requested', isAuthenticated, findRequestedEvents)
router.get('/participant', isAuthenticated, findParticipatingEvents)
router.get('/creator/:userId', isAuthenticated, findEventsByCreator)
router.get('/:eventId', isAuthenticated, findEventById)
router.get('/:eventId/participants', isAuthenticated, findEventParticipants)
router.put('/:eventId', isAuthenticated, updateEvent)
router.delete('/:eventId', isAuthenticated, deleteEvent)

export default router
