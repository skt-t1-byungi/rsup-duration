# rsup-duration
Convenient duration time utility

[![npm](https://flat.badgen.net/npm/v/rsup-duration)](https://www.npmjs.com/package/rsup-duration)
[![travis](https://flat.badgen.net/travis/skt-t1-byungi/rsup-duration)](https://travis-ci.org/skt-t1-byungi/rsup-duration)

## Install
```sh
npm install rsup-duration
```
```js
import duration from 'rsup-duration'
```

## Example
```js
const d = duration()

console.log(d.isPast) // => false
console.log(d.isDuring) // => false

d.start(1000)
console.log(d.isPast) // => false
console.log(d.isDuring) // => true

await d.onStop() // Resolved after 1 second.

console.log(d.isPast) // => true
console.log(d.isDuring) // => false

d.start(1000)
console.log(d.isPast) // => false
console.log(d.isDuring) // => true

delay(200).then(()=> d.stop())
await d.onStop() // Resolved after 200ms.
```

## API
### duration(defaultMs = 0)
Create a duration instance.

### d.isPast
Returns whether the duration has passed.

### d.isDuring
Returns whether the duration is in progress.

### d.start(options)
Start time. If already in progress, this call is ignored.

##### options

- `ms` - duration time. If not, it is specified as `defaultMs`.
- `force`  - If `force` is true, stop and new start when time is in progress.

```js
const d = duration(1000)
d.start() // ms = 1000, force = false
d.start(500) // ms = 500, force = false
d.start({ms: 500}) // ms = 500, force = false
d.start({ms: 1000, force: true}) // // ms = 1000, force = true
```

Returns the promise that waits until stop.
```js
console.log(d.isPast) // => false
await d.start(1000) // Resolved after 1 second.
console.log(d.isPast) // => true
```

### d.stop()
Stop time.

```js
d.start(1000)
delay(200).then(()=> d.stop())
await d.onStop() // Resolved after 200ms.
```

### d.onStop()
Returns the promise that waits until stop.

## License
MIT
