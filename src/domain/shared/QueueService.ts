export interface QueueService {
    sendBookSoldEmail: (params: { sellerId: number; bookTitle: string; bookPrice: number }) => void;
}