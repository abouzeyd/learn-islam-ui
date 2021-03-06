import React, { FC } from 'react'
import { navigate } from 'gatsby'

const isLoggedIn = () => ''

type propTypes = {
  component: React.ElementType
}

const PrivateRoute: FC<propTypes> = ({ component: Component, ...rest }) => {
  if (isLoggedIn()) {
    navigate('/login')
    return null
  }

  return <Component {...rest} />
}

export default PrivateRoute
