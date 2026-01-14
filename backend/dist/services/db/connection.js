import mongoose from 'mongoose';
import { logger } from '../../utils/logger.js';
export async function connectMongo(uri) {
    await mongoose.connect(uri, { autoIndex: true });
    logger.info('Mongo connected');
}
