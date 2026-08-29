import Sentry from '@sentry/node';
import { api } from './api';
import { Job, Worker } from 'bullmq';
import { environmentService } from './infrastructure/EnvironmentService';
import { PrismaUserRepository } from './infrastructure/user/repositories/PrismaUserRepository';
import { NodemailerEmailService } from './infrastructure/shared/NodemailerEmailService';

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