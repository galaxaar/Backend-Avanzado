import { BookRepository } from '../repositories/BookRepository';
import { QueueService } from '../../shared/QueueService';

//umbral de dias que esperamos hasta la bajada de precios (7)
const STALE_BOOK_THRESHOLD_DAYS = 7;

export class SendPriceSuggestionsUseCase {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly queueService: QueueService,
    ) { }

    async execute(): Promise<void> {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - STALE_BOOK_THRESHOLD_DAYS);

        const staleBooks = await this.bookRepository.findPublishedOlderThan(thresholdDate);

        for (const book of staleBooks) {
            this.queueService.sendPriceSuggestionEmail({
                sellerId: book.ownerId,
                bookTitle: book.title,
                bookPrice: book.price,
            });
        }
    }
}