import pDelay from '@byungi/p-delay'
import test from 'ava'
import duration from '.'

test('isDuring, isPast', async t => {
    const d = duration()
    t.false(d.isPast)
    t.false(d.isDuring)

    d.start(100)
    t.true(d.isDuring)

    await pDelay(50)
    t.true(d.isDuring)
    t.false(d.isPast)
    await pDelay(50)

    t.true(d.isPast)
    t.false(d.isDuring)
})

test('awaitable by start()', async t => {
    const d = duration()
    await d.start(100)
    t.true(d.isPast)
})

test('awaitable by waitOnStop()', async t => {
    const d = duration()
    d.start(100)
    await d.waitOnStop()
    t.true(d.isPast)
})

test('stop', async t => {
    const d = duration()
    d.start(100)
    await pDelay(50)
    t.true(d.isDuring)
    d.stop()
    t.false(d.isDuring)
})

test('can stop and restart immediately.', async t => {
    const d = duration()
    d.start(100)
    await pDelay(50)

    t.true(d.isDuring)
    d.stop()
    t.false(d.isDuring)
    d.start(100)
    t.true(d.isDuring)

    await pDelay(10) // next tick
    t.true(d.isDuring)

    await d.waitOnStop()
    t.false(d.isDuring)
})

test('default duration time', async t => {
    const d = duration(100)
    d.start()
    await pDelay(90)
    t.true(d.isDuring)
    await pDelay(11)
    t.true(d.isPast)
})

test('restart after past', async t => {
    const d = duration()
    await d.start(50)
    t.false(d.isDuring)
    d.restart()
    t.true(d.isDuring)
    await pDelay(60)
    t.false(d.isDuring)
})

test('restart in during', async t => {
    const d = duration()
    d.start(50)
    await pDelay(20)
    t.true(d.isDuring)
    d.restart()
    await pDelay(40)
    t.true(d.isDuring)
    await pDelay(20)
    t.false(d.isDuring)
})

test('If restart without ever starting, throws error', t => {
    const d = duration()
    t.throws(() => d.restart())
})
