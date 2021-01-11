import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

import Button from '../Button'
import FormInputField from '../FormInputField'
import FormInputTextArea from '../FormInputTextArea'
import FormDropdownField from '../FormDropdownField'
import GoogleAutoComplete from '../GoogleAutoComplete'
import { useFormFields } from '../../hooks/useFormFields'
import { genderOptions } from '../../util/constants/genderOptions'
import { AccountFormProps, AppState } from '../../types'
import './AccountForm.scss'

const AccountForm = ({ userId }: AccountFormProps) => {
  const user = useSelector((state: AppState) => state.user.user)
  const [address, setAddress] = useState({})
  const [fields, handleFieldChange] = useFormFields({
    email: user[0].email,
    first_name: user[0].first_name,
    last_name: user[0].last_name,
    date_of_birth: user[0].date_of_birth,
    gender: user[0].gender,
    base_address: user[0].base_address,
    profile_text: user[0].profile_text,
    profile_image: user[0].profile_image
  })

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    try {
      const update = { ...fields, address }
      console.log('yo')
      const res = await axios.put(`/api/v1/users/${userId}`, update)
      console.log(res.data)
      alert(
        'Thank you!\nThe changes have been saved and you can now safely leave this page, or make further changes if you spotted a mistake.'
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2 className='form__title'>Edit</h2>
      <FormInputField
        type='email'
        id='email'
        label='Email'
        value={fields.email}
        readOnly
      />
      <FormInputField
        type='text'
        id='first_name'
        label='First name'
        value={fields.first_name}
        onChange={handleFieldChange}
      />
      <FormInputField
        type='text'
        id='last_name'
        label='Last name'
        value={fields.last_name}
        onChange={handleFieldChange}
      />
      <FormInputField
        type='date'
        id='date_of_birth'
        value={fields.date_of_birth}
        label='Birthday'
        onChange={handleFieldChange}
      />
      <FormDropdownField
        label='Gender'
        id='gender'
        options={genderOptions}
        onBlur={handleFieldChange}
      />
      <FormInputField
        type='text'
        id='base_address'
        label='Default start address'
        value={
          fields.base_address
            ? 'Saved address: ' + fields.base_address
            : 'Saved address: No address saved'
        }
        readOnly
      />
      <GoogleAutoComplete handleAddress={setAddress} />
      <FormInputTextArea
        id='profile_text'
        label='Profile text'
        value={fields.profile_text}
        onChange={handleFieldChange}
        rows={1}
      />
      <div className='image-upload'>
        <FormInputField
          className='image-upload__field'
          type='url'
          id='profile_image'
          label='Image url'
          value={fields.profile_image}
          onChange={handleFieldChange}
        />
        {fields.profile_image && (
          <img
            className='image-upload__image'
            src={fields.profile_image}
            alt='What we currently display'
          />
        )}
      </div>
      <Button type='submit' text='Submit' />
    </form>
  )
}

export default AccountForm
