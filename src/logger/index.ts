import devLogger from './devLogger';
let logger = null;

if (process.env.NODE_ENV !== 'production') {
    logger = devLogger();
}

export default logger;
