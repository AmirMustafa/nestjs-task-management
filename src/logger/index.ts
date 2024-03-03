import devLogger from './devLogger';

console.log("Index.ts is imported.");

let logger = null;

if (process.env.NODE_ENV !== 'production') {
    logger = devLogger();
}

export default logger;
