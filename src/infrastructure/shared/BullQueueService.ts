import { QueueService } from '../../domain/shared/QueueService';
import { Queue } from 'bullmq';
import { environmentService } from '../EnvironmentService';

export class BullQueueService implements QueueService {
    private readonly bookSoldEmailQueue: Queue;
    private readonly priceSuggestionEmailQueue: Queue;

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
        //envio email bajada de precio
        this.priceSuggestionEmailQueue = new Queue('price-suggestion-email', connection);
    }

    async sendBookSoldEmail(params: { sellerId: number; bookTitle: string; bookPrice: number }) {
        await this.bookSoldEmailQueue.add('book-sold-email-job', params);
    }

    async sendPriceSuggestionEmail(params: { sellerId: number; bookTitle: string; bookPrice: number }) {
        await this.priceSuggestionEmailQueue.add('price-suggestion-email-job', params);
    }
}