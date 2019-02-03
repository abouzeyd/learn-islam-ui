import cx from 'classnames'
import PropTypes from 'prop-types'
import * as React from 'react'
import {
  compose,
  lifecycle,
  setPropTypes,
  withHandlers,
  withPropsOnChange,
} from 'recompose'
import addScoreWhenFinished from './addScoreWhenFinished'
import SelectInput from './SelectInput'

type DisplayAnswerProps = {
  answer?: string
  answerIndex?: number
  index: number
  value: string
}
const DisplayAnswer = ({
  answer,
  answerIndex,
  index,
  value,
}: DisplayAnswerProps) => {
  if (answerIndex === undefined) return <div className="green">{value}</div>
  if (answerIndex === index) return <div className="dark-blue">{value}</div>
  return (
    <div>
      <span className="dib dark-blue bt bw2 b--red lh0-9">{answer}</span>{' '}
      <div className="dib green">{value}</div>
    </div>
  )
}

interface Props {
  data: {
    values: Array<string>
  }
  handleAnswer: () => {}
  finished: boolean
  number: number
  orderedValues: Array<{index: number; text: string}>
  remainingValues: Array<{index: number; text: string}>
  score: number
  state: {
    answers?: Array<number>
  }
  textParts: Array<string>
  t: {
    fillInTheBlankTitle: string
    locale: string
  }
}
class FillInTheBlank extends React.PureComponent<Props> {
  state = {}

  myRefs = []

  componentDidMount() {
    // We fix the width of selects so it does not change
    setTimeout(() => {
      const maxWidth = this.myRefs.reduce((max, ref) => {
        if (!ref) {
          return max
        }
        // @ts-ignore
        const width = ref.offsetWidth
        return width > max ? width : max
      }, 0)
      this.setState({width: maxWidth}) // eslint-disable-line react/no-unused-state
    }, 500)
  }

  // @ts-ignore
  setRef = (ref, index) => {
    // @ts-ignore
    this.myRefs[index] = ref
  }

  render() {
    const {
      data: {values},
      finished,
      handleAnswer,
      number,
      orderedValues,
      remainingValues,
      score,
      state: {answers = []},
      textParts,
      t: {fillInTheBlankTitle, locale},
    } = this.props
    return (
      <div>
        <div className="pb2 flex bb items-center">
          <div className="flex-no-shrink mr2 b">{number} -&nbsp;</div>
          <div className="f4 b">{fillInTheBlankTitle}</div>
        </div>
        <div className="mt3 mb0 f4">
          {textParts.map((part, i) =>
            i === 0 ? (
              <span key={`part${i}`} className="lh1-75rem">
                {part}
              </span> // eslint-disable-line react/no-array-index-key
            ) : (
              [
                <div
                  className="dib"
                  key={`value${i - 1}`}
                  //   className="bg-light-green"
                >
                  {finished ? (
                    <DisplayAnswer
                      answer={
                        answers[i - 1] !== undefined
                          ? values[answers[i - 1]]
                          : ''
                      }
                      answerIndex={answers[i - 1]}
                      index={i - 1}
                      value={values[i - 1]}
                    />
                  ) : (
                    <SelectInput
                      name={i - 1}
                      onChange={handleAnswer}
                      options={remainingValues}
                      setRef={this.setRef}
                      style={this.state}
                      value={orderedValues.find(
                        ({index}) => index === answers[i - 1],
                      )}
                    />
                  )}
                </div>,
                <span key={`part${i}`} className="lh1-75rem">
                  {part}
                </span>, // eslint-disable-line react/no-array-index-key
              ]
            ),
          )}
        </div>
        {finished && (
          <div
            className={cx('mt3 f3', {
              tl: locale === 'ar',
              tr: locale !== 'ar',
              green: score > answers.length / 2,
              red: score <= answers.length / 2,
            })}
          >
            {score}/{answers.length}
          </div>
        )}
      </div>
    )
  }
}

const enhance = compose(
  setPropTypes({
    addData: PropTypes.func.isRequired,
    data: PropTypes.shape({
      text: PropTypes.string.isRequired,
      values: PropTypes.array.isRequired,
    }).isRequired,
  }),
  // @ts-ignore
  withPropsOnChange(['data'], ({data: {text, values}}) => ({
    orderedValues: values
      // @ts-ignore
      .map((value, index) => ({index, text: value}))
      // @ts-ignore
      .sort((a, b) => (a.text > b.text ? 1 : -1)),
    textParts: text.split('##'),
  })),
  lifecycle({
    componentDidMount() {
      // @ts-ignore
      const {addData, orderedValues, quizId, state} = this.props
      if (!state.answers)
        addData({
          data: {
            answers: new Array(orderedValues.length).fill(undefined),
          },
          quizId,
        })
    },
  }),
  // @ts-ignore
  withHandlers({
    // @ts-ignore
    handleAnswer: ({addData, quizId, state: {answers}}) => (e) => {
      const {name, value} = e.target
      const newAnswers = answers.slice()
      newAnswers[name] = value !== '' ? parseInt(value, 10) : undefined
      addData({
        data: {
          answers: newAnswers,
        },
        quizId,
        started: true,
      })
    },
  }),
  // @ts-ignore
  withPropsOnChange(['state'], ({orderedValues, state: {answers = []}}) => {
    // @ts-ignore
    const notChosen = ({index}) => !answers.includes(index)
    return {
      remainingValues: orderedValues.filter(notChosen),
    }
  }),
  // @ts-ignore
  withPropsOnChange(['finished'], ({finished, state: {answers = []}}) => {
    if (!finished) {
      return {score: 0}
    }
    return {
      score: answers.reduce((acc, answer, index) => {
        if (answer === index) return acc + 1
        return acc
      }, 0),
    }
  }),
  addScoreWhenFinished,
)
// @ts-ignore
export default enhance(FillInTheBlank)