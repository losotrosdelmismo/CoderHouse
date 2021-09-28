class MessageDTO {

    constructor(message) {        
        this.message = message;
        this.id = message.id;
        this.text = message.texto;
        this.author = message.autor;
        this.timestamp = message.date;       
    }

    getId() {
        return this.id;
    }

    getText() {
        return this.text;
    }

    getAuthor() {
        return this.author;
    }

    getTimestamp() {
        return this.timestamp
    }
}

module.exports = MessageDTO;