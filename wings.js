import { io } from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js'

class Wings {

    socket;

    channel;

    static init( query = {}) {
        const self = new this();

        self.#initWebSocket( query );
        self.#listen();

        return self;
    }

    #initWebSocket( query ) {
        this.socket = io();

        this.socket.on('connect', () => {
            this.socket.emit('join', query.name );
        });
    }

    #listen() {
        const events = ['connect', 'disconnect', 'error', 'message', 'stream'];

        events.forEach(event => {
            this.socket.on(event, (data) => {
                this.#call(event, data);
            });
        });
    }

    #callbacks = {};

    on(event, callback) {
        this.#callbacks[event] = this.#callbacks[event] || [];
        this.#callbacks[event].push(callback);
    }

    remove(event) {
        delete this.#callbacks[event];
    }

    emit(event, data) {
        return this.socket.emit(event, data);
    }

    #call(event, data) {
        if (this.#callbacks[event]) {
            this.#callbacks[event].forEach(callback => {
                callback(data);
            });
        }
    }

    onConnect(callback) {
        this.on('connect', callback);
    }

    onDisconnect(callback) {
        this.on('disconnect', callback);
    }

    onError(callback) {
        this.on('error', callback);
    }

    onMessage(callback) {
        this.on('message', callback);
    }

    onStream(callback) {
        this.on('stream', callback);
    }

    // Send message to room.
    message(data) {
        return this.socket.emit('message', data);
    }

    // Broadcast message to room except sender.
    broadcast(data) {
        return this.socket.emit('broadcast', data);
    }

    // Stream.
    stream(data) {
        this.socket.emit('stream', data);
    }

}


export default Wings;
