import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import Modal from '../Modal'
import Button from '../Button'
import EventTitle from '../EventTitle'
import EventImage from '../EventImage'
import ModalMessageCancel from '../ModalMessageCancel'
import EventCommentSection from '../EventCommentSection'
import EventParticipantsAndRequests from '../EventParticipantsAndRequests'
import useEventParticipants from '../../hooks/useEventParticipants'
import useEventRequests from '../../hooks/useEventRequests'
import { EventProps } from '../../types'
import './HostedEvent.scss'

const EventHosted = ({ event }: EventProps) => {
  const { event_id, created_at, image, title } = event
  const history = useHistory()
  const [participants] = useEventParticipants(event_id)
  const [requests] = useEventRequests(event_id)
  const [hideComments, setHideComments] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')

  const handleEndEvent = async () => {
    try {
      await axios.delete(`/api/v1/events/${event_id}`)
      setShowModal(false)
      alert('Event Successfully Deleted!')
    } catch (error) {
      alert(`Sorry, something went wrong. Please try again.\n\n${error}`)
    }
  }

  const populateModal = () => {
    if (modalContent === 'participants')
      return (
        <EventParticipantsAndRequests
          joinRequests={requests}
          participants={participants}
        />
      )
    if (modalContent === 'cancel')
      return (
        <ModalMessageCancel
          title={`Are you sure you want to cancel the event: ${title}?`}
          additionalText='The event, including comments and participant information, will be permanently deleted and it cannot be undone.'
          confirmFunction={handleEndEvent}
          cancelFunction={() => setShowModal(false)}
        />
      )
    return (
      <p>Error - Please try again and let us know what you did to get here</p>
    )
  }

  const handleModal = (id: string) => {
    setModalContent(id)
    setShowModal(true)
  }

  return (
    <div className='hosted-event'>
      {showModal && (
        <Modal
          closeModal={() => setShowModal(false)}
          content={populateModal()}
        />
      )}

      <EventTitle title={title} createdAt={created_at} />

      <div className='hosted-event__content'>
        <EventImage src={image} alt={title} />

        <div className='hosted-event__buttons'>
          <Button
            type='button'
            text='Manage participants'
            modifier='primary'
            id='participants'
            onClick={(e) => handleModal(e.target.id)}
          />
          <Button
            type='button'
            text='Edit event'
            modifier='primary'
            onClick={() => history.push(`/event/${event_id}/edit`)}
          />
          <Button
            type='button'
            text='Cancel event'
            modifier='primary'
            id='cancel'
            onClick={(e) => handleModal(e.target.id)}
          />
          <Button
            type='button'
            text='Comments'
            modifier='primary'
            onClick={() => setHideComments(!hideComments)}
          />
        </div>
      </div>

      <div hidden={hideComments}>
        <EventCommentSection eventId={event_id} />
      </div>

      <hr className='hosted-event__line' />
    </div>
  )
}

export default EventHosted