import React, { Fragment } from 'react'
import css from 'glamor-jss'
import JssDarkIcon from './jss-dark.svg'
import JssLightIcon from './jss-light.svg'
import Switch from './Switch'

export const TRANSITION_DURATION = 250

const styles = {
  wrapper: css({
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: `${TRANSITION_DURATION}ms`,
  }),
  underline: (backgroundColor, lineColor) =>
    css({
      display: 'inline-block',
      textDecoration: 'none',
      paddingBottom: 4,
      marginBottom: -4,
      backgroundImage: `linear-gradient(${lineColor}, ${lineColor})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 1px',
      backgroundPosition: 'center bottom 26%',
      backgroundOrigin: 'padding-box',
      textShadow: `3px 0 ${backgroundColor},
      2px 0 ${backgroundColor},
      1px 0 ${backgroundColor},
      -1px 0 ${backgroundColor},
      -2px 0 ${backgroundColor},
      -3px 0 ${backgroundColor}`,
    }),

  imageWrapper: color =>
    css({
      position: 'relative',
      width: 200,
      height: 200,
      '& div': {
        position: 'absolute',
        transition: `${TRANSITION_DURATION}ms`,
      },
      ':before': {
        content: `'*'`,
        transition: `${TRANSITION_DURATION}ms`,
        position: 'absolute',
        right: '-15px',
        top: 75,
        color,
        fontSize: 42,
        fontWeight: 'bold',
      },
    }),

  switch: css({
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 50,
  }),
}

export default class App extends React.Component {
  state = {
    lightsOn: true,
  }

  handleButtonClick = () => this.setState(({ lightsOn }) => ({ lightsOn: !lightsOn }))

  render() {
    const { lightsOn } = this.state

    const background = lightsOn ? '#fff' : '#25292f'
    const fontColor = lightsOn ? '#000' : '#f7df1f'

    return (
      <Fragment>
        <div {...css(styles.wrapper, { background })}>
          <div {...styles.imageWrapper(fontColor)}>
            <a
              href="https://github.com/cssinjs/jss"
              {...css({ width: '100%', height: '100%', display: 'block' })}
            >
              <div {...css({ opacity: !lightsOn && 0 })}>
                <img src={JssLightIcon} width={200} />
              </div>
              <div {...css({ opacity: lightsOn && 0 })}>
                <img src={JssDarkIcon} width={200} />
              </div>
            </a>
          </div>

          <div
            {...css({
              fontSize: 21,
              transform: 'translateX(-8%)',
            })}
          >
            <span
              {...css({
                color: fontColor,
                transition: `${TRANSITION_DURATION}ms`,
              })}
            >
              *
            </span>
            <a href="https://github.com/threepointone/glamor">
              <span
                {...css({
                  display: 'inline-block',
                  color: fontColor,
                  transition: `
                    transform 1000ms cubic-bezier(0.25, -0.5, 0.75, 1.4),
                    color ${TRANSITION_DURATION}ms,
                    background ${TRANSITION_DURATION}ms,
                    text-shadow ${TRANSITION_DURATION}ms
                  `,
                  ':hover': { transform: 'rotateY(360deg)' },
                })}
              >
                with&nbsp;
                <span
                  {...css(styles.underline(background, '#cdbe4c'), {
                    color: fontColor,
                    transition: `${TRANSITION_DURATION}ms`,
                  })}
                >
                  glamor
                </span>
                &nbsp;flavor
              </span>
            </a>
          </div>
        </div>
        <div {...styles.switch}>
          <Switch onClick={this.handleButtonClick} on={lightsOn} />
        </div>
      </Fragment>
    )
  }
}
