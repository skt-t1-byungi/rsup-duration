import Deferred from 'p-state-defer'

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
        return this._started && this._defer === null
    }

    get isDuring () {
        return this._defer !== null
    }

    public start (force?: boolean): Promise<void>
    public start (ms: number, force?: boolean): Promise<void>
    public start (ms?: number | boolean, force = false) {
        if (typeof ms === 'undefined') ms = false
        if (typeof ms === 'boolean') {
            force = ms
            ms = this._defaultMs
        }

        this._started = true
        if (!force && this._defer) return this._defer.promise

        this.stop()
        this._defer = new Deferred()
        this._timerId = setTimeout(this._end, ms)

        return this._defer.promise
    }

    public stop () {
        if (this._timerId) clearTimeout(this._timerId)
        this._end()
    }

    private _end () {
        this._timerId = null
        const defer = this._defer
        if (defer) {
            this._defer = null
            defer.resolve()
        }
    }

    public waitOnStop () {
        return this._defer ? this._defer.promise : Promise.resolve()
    }
}

export const duration = (ms?: number) => new Duration(ms)

export default duration
