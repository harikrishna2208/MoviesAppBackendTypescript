import { Prisma, PrismaClient, Review } from '@prisma/client';

const prisma = new PrismaClient();


export const getReviewsByMovieId = async (movieId: number) => {
    const reviews = await prisma.review.findMany({
        where: { movieId },
    });
    return reviews;
};
export const createReview = async (movieId: number, userId: number, rating: number, comment: string) => {
    const review = await prisma.review.create({
        data: { movieId, userId, rating, comment },
    });
    return review;
};
export const updateReview = async (reviewId: number, rating: number, comment: string) => {
    const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: { rating, comment },
    });
    return updatedReview;
};

export const deleteReview = async (reviewId: number) => {
    await prisma.review.delete({ where: { id: reviewId } });
};

