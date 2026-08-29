import { QueueService } from '../../domain/shared/QueueService';
import { Queue } from 'bullmq';
import { environmentService } from '../EnvironmentService';

export class BullQueueService implements QueueService {
    private readonly bookSoldEmailQueue: Queue;

    constructor() {
        const { REDIS_URL } = environmentService.get();
        const redisUrl = new URL(REDIS_URL);
        const connection = {
            connection: {
                host: redisUrl.hostname,
                port: Number(redisUrl.port),
            },
        };
        //envio del email de vendido
        this.bookSoldEmailQueue = new Queue('book-sold-email', connection);
    }

    async sendBookSoldEmail(params: { sellerId: number; bookTitle: string; bookPrice: number }) {
        await this.bookSoldEmailQueue.add('book-sold-email-job', params);
    }
}