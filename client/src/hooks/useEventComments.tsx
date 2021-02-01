import { useState, useEffect } from 'react'
import axios from 'axios'

import { EventId, Comment } from '../types'

const useEventComments = (eventId: EventId) => {
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/v1/comments/${eventId}`)
      setComments(data)
    } catch (error) {
      console.log(error)
    }
  }
  return [comments]
}

export default useEventComments
