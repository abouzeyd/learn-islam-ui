import React from 'react'
import { Styled, ThemeProvider } from 'theme-ui'
import { ThemeProvider as MaterialThemeProvider } from '@material-ui/core/styles'
import theme from 'styles/theme'
import materialTheme from 'styles/materialTheme'
import 'styles/custom.scss'
import 'styles/fonts.scss'
import 'styles/theme.scss'
import '@material/react-ripple'
import { withTrans } from '../i18n/withTranslation'

type Props = {
  children?: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <MaterialThemeProvider theme={materialTheme}>
      <Styled.root>
        {children}
        <link rel="stylesheet" href="https://unpkg.com/tachyons@4.9.1/css/tachyons.min.css" />
      </Styled.root>
    </MaterialThemeProvider>
  </ThemeProvider>
)

export default withTrans(Layout)
