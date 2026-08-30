export interface QueueService {
    sendBookSoldEmail: (params: { sellerId: number; bookTitle: string; bookPrice: number }) => void;
    // bajada de precio
    sendPriceSuggestionEmail: (params: {sellerId: number; bookTitle: string; bookPrice: number}) => void;
}