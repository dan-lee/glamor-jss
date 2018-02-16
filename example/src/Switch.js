import React from 'react'
import css from 'glamor-jss'
import { TRANSITION_DURATION } from './App'
const styles = {
  socket: on =>
    css({
      background: on ? '#e8e8e8' : '#cdbe4c',
      width: 35,
      height: 55,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: `inset 0 0 7px rgba(0, 0, 0, 0.2), ${
        on ? '0 0 1px #25292f' : '0 0 6px 2px #545454'
      }`,
      borderRadius: 1,
      cursor: 'pointer',
    }),
  switch: on =>
    css({
      width: '35%',
      height: '50%',
      background: '#444',
      position: 'relative',
      ':after': {
        content: `''`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
        transition: `${TRANSITION_DURATION}ms`,
        background: '#dadada',
        transform: !on && 'translateY(100%)',
        border: '1px solid #888',
        boxShadow: `inset 0px ${on ? '-' : ''}5px 2px #a9a9a9`,
      },
    }),
}

const Switch = ({ on, onClick }) => (
  <div {...styles.socket(on)} onClick={onClick}>
    <div {...styles.switch(on)} />
  </div>
)

export default Switch
