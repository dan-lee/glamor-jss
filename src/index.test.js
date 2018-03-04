import css, { renderToString, reset } from './index'
import Manager, { MAX_RULES } from './Manager'

describe('css', () => {
  beforeEach(reset)

  test('Simple styles', () => {
    const style = css({ width: 100, height: 100 })
    expect(renderToString()).toMatchSnapshot()
    expect(style.toString()).not.toBeUndefined()

    expect(Object.keys({ ...style })[0]).toEqual(
      expect.stringMatching(/^data-css/)
    )

    expect(css()).toBeUndefined()
  })

  test('Keyframes work without collision', () => {
    css.keyframes('fade', { from: { opacity: 0 }, to: { opacity: 1 } })
    css.keyframes('fade', { from: { opacity: 0 }, to: { opacity: 1 } })
    css.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
    css.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
    expect(renderToString()).toMatchSnapshot()
  })

  test('Falsy values', () => {
    css({ width: null, height: undefined, minWidth: false, ':hover': {} }, null)
    css([null, {}, []])
    css({ ':after': { width: false && 100, height: 100 } })

    expect(renderToString()).toMatchSnapshot()
  })

  test('Complex styles', () => {
    const bold = css({
      fontWeight: 'bold',
    })
    css(
      [
        { color: 'lightgoldenrodyellow' },
        { height: 150, ':hover': { color: 'khaki' } },
      ],
      {
        border: '1px solid mediumaquamarine',
        width: 350,
        borderRadius: '50%',
      },
      [
        {
          color: 'papayawhip',
          '@media (min-width: 800px)': { background: 'peachpuff' },
        },
        {
          ':hover': {
            color: 'orchid',
          },
        },
      ],
      bold
    )

    expect(renderToString()).toMatchSnapshot()
  })

  test('Nested functional styles', () => {
    const activeStyle = {
      color: 'peachpuff',
      ':before': {
        top: 10,
      },
    }

    const style = hover =>
      css({
        position: 'relative',
        color: 'gray',
        ':before': {
          position: 'absolute',
          content: `""`,
          top: 0,
        },
        ':hover': hover && activeStyle,
      })

    const styles = toggle => css(style(toggle), toggle && activeStyle)
    expect(styles(true)).toEqual({ 'data-css-792391987': '' })
    expect(styles(false)).toEqual({ 'data-css-2598794915': '' })
    expect(renderToString()).toMatchSnapshot()
  })

  test('Overwrite styles', () => {
    css(
      css({ color: 'mediumaquamarine' }),
      { color: 'peachpuff' },
      css({ color: 'lightcoral' }),
      { color: 'papayawhip' },
      css({ color: 'thistle' })
    )

    expect(renderToString()).toMatchSnapshot()
  })

  test('Multiple styles', () => {
    const props = {
      ...css({ color: 'peachpuff' }),
      ...css({ width: '100vw' }),
    }

    expect(Object.keys(props)).toMatchSnapshot()
  })

  test('Cache styles', () => {
    const complex = [
      [
        { color: 'lightgoldenrodyellow' },
        { height: 150, ':hover': { color: 'khaki' } },
      ],
      {
        border: '1px solid mediumaquamarine',
        width: 350,
        borderRadius: '50%',
      },
      [
        {
          color: 'papayawhip',
          '@media (min-width: 800px)': { background: 'peachpuff' },
        },
      ],
    ]

    expect(css({ color: 'red' })).toBe(css({ color: 'red' }))
    expect(css({ width: y => y + 1 })).toEqual(css({ width: y => y + 1 }))
    expect(css(complex)).toBe(css(complex))
  })

  test('Max rules', () => {
    const man = new Manager()
    man.rulesCount = MAX_RULES - 1
    man.addRule('test', { color: 'red' })

    expect(man.registry.registry).toHaveLength(2)
  })
})
