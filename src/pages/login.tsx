/** @jsx jsx */
import BlueHero from 'components/molecules/Hero/BlueHero'
import HomeFooter from 'components/molecules/Footer/HomeFooter'
import { useFormik, FormikErrors } from 'formik'
import { Button, jsx, Label, Input, Box, Checkbox } from 'theme-ui'
import { navigate } from 'gatsby'
import Helmet from 'react-helmet'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { AuthContext } from 'services/auth'
import { FC, useState, Fragment, useContext } from 'react'

type FormValues = {
  lastName: string
  firstName: string
  email: string
  password: string
}

type PropTypes = {
  path?: string
}

const Login: FC<PropTypes> = () => {
  const [isNew, setIsNew] = useState(false)
  const { i18n, t } = useTranslation()
  const { useAuth } = useContext(AuthContext)

  const { addNewUser, signInWithEmailAndPwd, authUser } = useAuth()

  const formik = useFormik<FormValues>({
    initialValues: {
      lastName: '',
      firstName: '',
      email: '',
      password: '',
    },

    validate: (values) => {
      const errors: FormikErrors<typeof values> = {}
      if (!values.email) {
        errors.email = 'Email is mandatory'
      }
      return errors
    },

    onSubmit: async (values) => {
      try {
        if (isNew) {
          await addNewUser(values.email, values.password)
        } else {
          await signInWithEmailAndPwd(values.email, values.password)
        }
      } catch (err) {
        console.log(err)
      }
    },
  })

  if (authUser) {
    navigate('/app/profile')
    return null
  }

  return (
    <div className={cx({ rtl: i18n.language === 'ar' })}>
      <Helmet>
        <html lang={i18n.language} />
      </Helmet>
      <div>
        <BlueHero description={t('blueHeroLoginDescription')} title={t('blueHeroLoginTitle')} />
        <div
          sx={{
            maxWidth: 700,
            minHeight: 400,
            mx: 'auto',
            px: 3,
            py: 4,
          }}
        >
          <div
            sx={{
              textAlign: 'center',
            }}
          >
            <p>
              {isNew ? t('allreadyHaveAccount') : t('haveAccount')}
              <a
                role="button"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => setIsNew((prev) => !prev)}
              >
                {isNew ? t('identification') : t('registerAccount')}
              </a>
            </p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <Label htmlFor="email" mb={2}>
              {t('loginUserName')}
            </Label>
            {isNew && (
              <Fragment>
                <Input
                  name="firstName"
                  type="text"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  mb={3}
                />
                <Label htmlFor="firstName" mb={2}>
                  {t('loginFirstName')}
                </Label>
                <Input
                  name="lastName"
                  type="text"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  mb={3}
                />
                <Label htmlFor="lastName" mb={2}>
                  {t('loginLastName')}
                </Label>
              </Fragment>
            )}
            <Input name="email" type="email" value={formik.values.email} onChange={formik.handleChange} mb={3} />
            <Label htmlFor="password" mb={2}>
              {t('loginPassword')}
            </Label>
            <Input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              mb={3}
            />
            {isNew && (
              <Box mb={3}>
                <Label
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <Checkbox />
                  {t('loginCheckBox')}
                </Label>
              </Box>
            )}
            <Button
              type="submit"
              sx={{
                ml: 2,
              }}
            >
              {t('loginButton')}
            </Button>
          </form>
        </div>
        <HomeFooter firstTrackSlug="add" withTrackSlug={false} />
      </div>
    </div>
  )
}

export default Login