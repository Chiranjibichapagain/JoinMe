import { Response } from 'express'
import jwt from 'jsonwebtoken'

import generateToken from '../helpers/generateToken'
import { GoogleToken, User } from '../types'
import db from '../db'

const googleLogin = async (id_token: string, res: Response) => {
  const decodedToken = jwt.decode(id_token)
  const { given_name, family_name, picture, email } = decodedToken as GoogleToken
  try {
    const DBResponse = await db.query('SELECT * FROM userk WHERE email = $1', [email])
    const user: User = DBResponse.rows[0]

    if (!user) {
      const createUser = await db.query(
        'INSERT INTO userk (profile_image, first_name, last_name, email) VALUES ($1, $2, $3, $4) RETURNING *',
        [picture, given_name, family_name, email]
      )
      const newUser: User = createUser.rows[0]
      const token = generateToken(newUser.user_id)
      res.cookie('x-auth-token', token)
      return newUser
    } else {
      const token = generateToken(user.user_id)
      res.cookie('x-auth-token', token)
      return user
    }
  } catch (error) {
    return error
  }
}

const findUserById = async (userId: string) => {
  try {
    const DBResponse = await db.query('SELECT * FROM userk WHERE user_id = $1', [userId])
    const user: User = DBResponse.rows[0]
    return user
  } catch (error) {
    return error
  }
}

const findAllUsers = async () => {
  try {
    const DBResponse = await db.query('SELECT * FROM userk')
    const users: User[] = DBResponse.rows
    return users
  } catch (error) {
    return error
  }
}

const updateUser = async (userId: string, update: Partial<User>) => {
  try {
    const userResponse = await db.query('SELECT * FROM userk WHERE user_id = $1', [userId])
    const user: User = userResponse.rows[0]

    if (!user) {
      throw new Error()
    }

    const {
      first_name = user.first_name,
      last_name = user.last_name,
      profile_image = user.profile_image,
      profile_text = user.profile_text,
      address = {
        street: '',
        number: 0,
        postal_code: 12345,
        city: '',
        country: '',
        lat: 0,
        lng: 0
      },
      date_of_birth = user.date_of_birth,
      gender = user.gender
    } = update

    const { street, postal_code, city, country, lat, lng } = address
    let { number } = address
    !number && (number = 0)
    let addressId: string

    const addressResponse = await db.query(
      'SELECT address_id FROM address WHERE lat = $1 and lng = $2',
      [lat, lng]
    )

    if (addressResponse.rowCount === 0) {
      const newAddress = await db.query(
        'INSERT INTO address (street, number, postal_code, city, country, lat, lng) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING address_id',
        [street, number, postal_code, city, country, lat, lng]
      )
      addressId = newAddress.rows[0].address_id
    } else {
      addressId = addressResponse.rows[0].address_id
    }

    const updateUser = await db.query(
      'UPDATE userk SET first_name = $2, last_name = $3, profile_image = $4, profile_text = $5, base_address = $6, date_of_birth = $7, gender = $8 WHERE user_id = $1 RETURNING *',
      [userId, first_name, last_name, profile_image, profile_text, addressId, date_of_birth, gender]
    )
    const updatedUser: User = updateUser.rows[0]
    return updatedUser
  } catch (error) {
    return error
  }
}

const deleteUser = async (userId: string) => {
  const DBResponse = await db.query('SELECT * FROM userk WHERE user_id = $1', [userId])
  const user: User = DBResponse.rows[0]

  if (!user) {
    throw new Error()
  } else {
    await db.query('DELETE FROM userk WHERE user_id = $1;', [userId])
    return { message: 'User deleted' }
  }
}

export default {
  findUserById,
  findAllUsers,
  updateUser,
  googleLogin,
  deleteUser
}
