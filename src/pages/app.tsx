/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { Router } from '@reach/router'
import AppNavBar from '../components/molecules/AppNavBar/AppNavBar'
import CssBaseLine from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import { Fragment } from 'react'
import Profile from 'components/modules/Profile/Profile'

type LayoutContainerProps = {
  children: React.ReactChild
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({ children }) => (
  <div
    sx={{
      mx: 'auto',
    }}
  >
    {children}
  </div>
)

const App = () => {
  return (
    <Fragment>
      <CssBaseLine />
      <div
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          variant: 'layout.root',
        }}
      >
        <header
          sx={{
            width: '100%',
            variant: 'layout.header',
          }}
        >
          <LayoutContainer>
            <AppNavBar />
          </LayoutContainer>
        </header>
        <main
          sx={{
            width: '100%',
            flex: '1 1 auto',
            variant: 'layout.main',
          }}
        >
          <Container
            sx={{
              mt: 3,
            }}
            maxWidth="sm"
          >
            <Router basepath="/app">
              <Profile path="/profile" />
            </Router>
          </Container>
        </main>
        <footer
          sx={{
            width: '100%',
            variant: 'layout.footer',
          }}
        ></footer>
      </div>
    </Fragment>
  )
}

export default App