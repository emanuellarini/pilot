import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormDropdown } from 'former-kit'

const toDropdownOptions = ({ name, id }) => ({ name, value: id })

const SelectAccount = ({
  accounts,
  name,
  onChange,
  label,
  value,
}) => {
  const options = accounts.map(toDropdownOptions)

  return (
    <Fragment>
      <label htmlFor={name}>{label}</label>
      <FormDropdown
        type="form"
        name={name}
        title={label}
        options={options}
        onChange={onChange}
        value={value}
      />
    </Fragment>
  )
}

SelectAccount.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
}

SelectAccount.defaultProps = {
  accounts: [],
  onChange: () => {},
  value: '',
}

export default SelectAccount
