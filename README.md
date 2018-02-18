# glamor-jss

Use [`glamor`](https://github.com/threepointone/glamor) flavored CSS with [`jss`](https://github.com/cssinjs/jss) under the hood…

## Install

```sh
yarn add glamor-jss
```

## Features

* 📦 Zero configuration *(just like glamor)*.
* ⚡️ Server side rendering ready.
* 💭 Caching mechanisms
* 🕸 Hoist static style rules with babel plugin.
* 🏎💨 [Blazingly fast](https://github.com/cssinjs/jss/blob/master/docs/performance.md), thanks to JSS behind scenes.

## Reasoning

I'm a big fan of `glamor`.  
Unfortunately it seems like a stale project, but I don't want to give up on it just yet.  my idea was to keep the simple and hands on usage of glamor and back it up with something bigger in the background.

That's why I created `glamor-jss`. It's not a plugin but more kind of like a wrapper around it.

I wanted it to be fast. And I wanted it to be smart.

Of course I couldn't lift these heavy tasks all alone. I did some thorough research to back up this project with a bunch of great other projects:

* [`hash-it`](https://github.com/planttheidea/hash-it): blazing fast hash calculations for objects (check [`/perf`](perf/) if you're interested) to cache the 💩 out of it.
* [`memoize-weak`](https://github.com/timkendrick/memoize-weak): combined with the hoisting plugin for babel this produces even better caching possibilites (uses `WeakMap` if possible).

and of course, let's not forget

* [`jss`](https://github.com/cssinjs/jss): Does all the heavy lifting in the `CSSOM`

This is by no means feature complete and only supports the CSS object definition (e.g.: `css({ width: 100 })`) for now

## Usage

🎊 **[See the demo](https://glamor-jss.now.sh)** 🎉

For further documentation on how to declare styles, I'd like to refer to the [glamor API guidelines](https://github.com/threepointone/glamor/blob/master/docs/api.md).


### 🍨 Vanilla
```js
import css from 'glamor-jss'
// oldschool require:
// const css = require('glamor-jss').default

const myClass = css({ color: 'red' })
document.body.innerHTML = `<div class="${myClass}">RED 🎈</div>`
```

### 🔋 React

```jsx
import React from 'react'
import css from 'glamor-jss'

const AwesomeComponent = () => (
  <div {...css({ color: 'red' )}>RED 🎈</div>

  // will result in the same as:
  // <div className={css({ color: 'red' )} />
)
```

### 💁‍♀️ Server side rendering (SSR)

It's to add the generated styles on the server side (also see [`example/src/server.js`](example/src/server.js)):

```js
// …
import { renderToString } from 'glamor-jss'

// … eventually
res.status(200).send(`
  <!doctype html>
  <html>
    <style>${renderToString()}</style>
  </html>
`)
```

### 🐠 Babel plugin

```json
// .babelrc
{
  "plugins": ["glamor-jss/lib/hoist"]
}
```

**What does it do?** 🤔

Every statically declared rule will be moved to the outermost scope. This opens up the possibility for heavy caching.

For example:

**In**

```js
import css from 'glamor-jss'

const Component = props => (
  <div {...css({ width: 100, height: 100 })}>
    <div {...css({ ':after': { content: "'*'" } })} />
	<div {...css({ background: props.background })} />
  </div>
)
```

**Out**

```js
import css from 'glamor-jss'

var _ref = { width: 100, height: 100 };
var _ref2 = { ':after': { content: "'*'" } };

const Component = props => (
  <div {...css(_ref)}>
    <div {...css(_ref2)} />
	<div {...css({ background: props.background })} />
  </div>
)
```
