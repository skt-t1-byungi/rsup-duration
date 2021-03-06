import pDefer, { Deferred } from '@byungi/p-defer'

export class Duration {
    private _defer: Deferred<void> | null = null
    private _timerId: ReturnType<typeof setTimeout> | null = null
    private _started = false

    constructor (
        private _defaultMs: number = 0
    ) {
        this._end = this._end.bind(this)
    }

    get isPast () {
        return this._started && this._timerId === null
    }

    get isDuring () {
        return this._timerId !== null
    }

    public start (opts: number | {ms?: number, force?: boolean} = { ms: this._defaultMs, force: false }) {
        if (typeof opts === 'number') opts = { ms: opts, force: false }

        this._started = true
        if (!opts.force && this._defer) return this._defer.promise

        if (this.isDuring) this.stop()
        const defer = this._defer = pDefer()

        if (opts.ms && opts.ms > 0) {
            this._timerId = setTimeout(this._end, opts.ms)
        } else {
            this._end()
        }

        return defer.promise
    }

    public stop () {
        if (this._timerId) clearTimeout(this._timerId)
        this._end()
    }

    private _end () {
        this._timerId = null

        if (this._defer) {
            this._defer.resolve()
            this._defer = null
        }
    }

    public onStop () {
        return this._defer ? this._defer.promise : Promise.resolve()
    }
}

export const duration = (ms?: number) => new Duration(ms)

export default duration
