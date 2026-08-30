import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';
import { BullQueueService } from '../../../infrastructure/shared/BullQueueService';
import { SendPriceSuggestionsUseCase } from '../../../domain/book/use-cases/send-price-suggestions';

export const sendPriceSuggestionsCron = async () => {
    console.log('Running weekly price suggestion cron job...');
    const bookRepository = new PrismaBookRepository();
    const queueService = new BullQueueService();
    const sendPriceSuggestionsUseCase = new SendPriceSuggestionsUseCase(bookRepository, queueService);

    try {
        await sendPriceSuggestionsUseCase.execute();
    } catch (error) {
        console.log(error);
    }
};