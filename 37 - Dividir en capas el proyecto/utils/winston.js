const winston = require('winston')

const logger = winston.createLogger({
    level: 'warn',
    transports : [
        new winston.transports.Console({level:'verbose'}),
        new winston.transports.File({ filename: './logs-winston/warn.log', level:'warn'}),
        new winston.transports.File({ filename: './logs-winston/error.log', level:'error'})        
    ]
})

module.exports = logger;