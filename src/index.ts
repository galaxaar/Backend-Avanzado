import Sentry from '@sentry/node';
import cron from 'node-cron';
import { api } from './api';
import { Job, Worker } from 'bullmq';
import { environmentService } from './infrastructure/EnvironmentService';
import { PrismaUserRepository } from './infrastructure/user/repositories/PrismaUserRepository';
import { NodemailerEmailService } from './infrastructure/shared/NodemailerEmailService';
import { sendPriceSuggestionsCron } from './ui/shared/cron/send-price-suggestions-cron';

environmentService.load();

const { PORT, SENTRY_DSN, NODE_ENV, REDIS_URL } = environmentService.get();

if (SENTRY_DSN) {
    Sentry.init({
        dsn: SENTRY_DSN,
        environment: NODE_ENV,
    });
}

api.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

cron.schedule('0 9 * * 1', sendPriceSuggestionsCron);

const redisUrl = new URL(REDIS_URL);
const workerConnection = {
    connection: {
        host: redisUrl.hostname,
        port: Number(redisUrl.port),
    },
};

new Worker(
    'book-sold-email',
    async (job: Job<{ sellerId: number; bookTitle: string; bookPrice: number }>) => {
        const userRepository = new PrismaUserRepository();
        const seller = await userRepository.findById(job.data.sellerId);
        const emailService = new NodemailerEmailService();

        await emailService.send({
            email: seller?.email ?? '',
            subject: 'Your book has been sold!',
            message: `Good news! Your book "${job.data.bookTitle}" has been sold for $${job.data.bookPrice}.`,
        });
    },
    workerConnection,
);

new Worker(
    'price-suggestion-email',
    async (job: Job<{ sellerId: number; bookTitle: string; bookPrice: number }>) => {
        const userRepository = new PrismaUserRepository();
        const seller = await userRepository.findById(job.data.sellerId);
        const emailService = new NodemailerEmailService();

        await emailService.send({
            email: seller?.email ?? '',
            subject: 'Consider lowering your book price',
            message: `Your book "${job.data.bookTitle}" (priced at $${job.data.bookPrice}) has been listed for more than 7 days without selling. Consider lowering its price to attract more buyers.`,
        });
    },
    workerConnection,
);

