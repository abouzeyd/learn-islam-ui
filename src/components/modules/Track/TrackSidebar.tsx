import React from 'react'
import { Link } from 'gatsby'
import Home from 'react-icons/lib/io/ios-home-outline'
import cx from 'classnames'

interface IProps {
  locale: string
  localePath: string
}
const TrackSidebar = ({ locale, localePath }: IProps) => (
  <div className="w2 w3-ns">
    <div
      className={cx('z-9999 fixed pt2 w2 w3-ns top-0 bottom-0 mdc-theme--primary-bg tc', {
        'right-0': locale === 'ar',
        'left-0': locale !== 'ar',
      })}
    >
      <Link to={localePath}>
        <Home className="f3 f1-ns white" />
      </Link>
    </div>
  </div>
)
export default TrackSidebar
