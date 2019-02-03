import cx from 'classnames'
import RawHTML from 'components/RawHTML'
import {Link} from 'gatsby'
import * as React from 'react'
import {ITracksTrack} from '../../types/tracks'

interface LinkOrChildrenProps {
  children: JSX.Element
  className?: string
  to: string | false
}
const LinkOrChildren = ({
  children,
  className = '',
  to,
}: LinkOrChildrenProps) => {
  if (to)
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )

  return children
}

interface Props {
  localePath: string
  soonString: string
  tracks: {
    node: ITracksTrack
  }[]
}
const Tracks = ({localePath, soonString, tracks}: Props) => (
  <div>
    {tracks.map(({node: {slug, soon, translations}}, i) => {
      const strings = translations.edges[0].node
      return (
        <LinkOrChildren
          key={slug}
          to={!soon && `${localePath}${slug}/`}
          className="no-underline"
        >
          <div
            className={cx(
              'mv4 mv5-ns pv3 flex justify-center black flex-column',
              {
                'flex-row-reverse-ns': i % 2,
                'flex-row-ns': !(i % 2),
              },
            )}
          >
            <div className="mh3 w5 h4 bg-light-gray" />
            <div className="mh3 measure-narrow">
              {!!soon && <span>{soonString}</span>}
              <h2>{strings.title}</h2>
              <RawHTML>{strings.description}</RawHTML>
            </div>
          </div>
        </LinkOrChildren>
      )
    })}
  </div>
)
export default Tracks