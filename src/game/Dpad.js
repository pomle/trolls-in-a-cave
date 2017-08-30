import EventEmitter from 'events';
import {Vector2} from 'three';

const UP = 0;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 1;

export const Maps = {
    WASD: [
        87,
        68,
        83,
        65,
    ],
    ARROW: [
        38,
        39,
        40,
        37,
    ],
};

export default class DPad extends EventEmitter
{
    constructor() {
        super();
        this.MAP = Maps.WASD;
        this.dir = new Vector2();
        this.state = new Map();

        this.handleEvent = this.handleEvent.bind(this);
    }

    handleEvent(event) {
        const k = event.keyCode;
        const t = event.type;
        if (this.state.get(k) === t) {
            return;
        }
        this.state.set(k, t);

        const s = t === 'keydown' ? 1 : -1;
        if (k === this.MAP[UP]) {
            this.dir.y += s;
        } else if (k === this.MAP[DOWN]) {
            this.dir.y -= s;
        } else if (k === this.MAP[LEFT]) {
            this.dir.x -= s;
        } else if (k === this.MAP[RIGHT]) {
            this.dir.x += s;
        }

        this.emit('change', this.dir);
    }

    listen(subject) {
        subject.addEventListener('keydown', this.handleEvent);
        subject.addEventListener('keyup', this.handleEvent);
    }

    unlisten(subject) {
        subject.removeEventListener('keydown', this.handleEvent);
        subject.removeEventListener('keyup', this.handleEvent);
    }
}
