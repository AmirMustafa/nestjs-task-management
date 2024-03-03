import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, prettyPrint } = format;

const devLogger = () => {
    return createLogger({
        level: 'debug',
        format: format.json(),
        transports: [
            // new transports.File({ filename: 'error.log', level: 'error' }),
            // new transports.File({ filename: 'combined.log' }),
            new transports.Console()
        ]
    });
};   

export default devLogger;
