import { Prisma, PrismaClient } from '@prisma/client';
import { Movie, Review } from '@prisma/client';
import * as reviewRepository from '../repositories/reviewRepository';
import * as movieRepository from '../repositories/moviesRepository';

const prisma = new PrismaClient();

export async function getReviewsByMovieId(movieId: number): Promise<Review[]> {
    const reviews = await reviewRepository.getReviewsByMovieId(movieId);
    return reviews;
}

export async function createReview(movieId: number, userId: number, rating: number, comment: string): Promise<Review> {
    const review = await reviewRepository.createReview(movieId, userId, rating, comment);
    return review;
}

export async function updateReview(reviewId: number, rating: number, comment: string): Promise<Review | null> {
    const updatedReview = await reviewRepository.updateReview(reviewId, rating, comment);
    return updatedReview;
}

export async function deleteReview(reviewId: number): Promise<void> {
    await reviewRepository.deleteReview(reviewId);
}

export async function getMovieById(movieId: number): Promise<Movie | null> {
    const movie = await movieRepository.findMovieById(movieId);
    return movie;
}


export const getAllReviews = async (
    sortBy: string | undefined,
    filterBy: string | undefined,
    page: string | undefined,
    perPage: string | undefined,
    userEmail: string | undefined
) => {

    // get user id by email to make the user review apprear on top
    const loggedInUser = await prisma.user.findFirst({
        where: { emailId: userEmail },
        select: { id: true },
    });

    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedPerPage = perPage ? parseInt(perPage, 10) : 10;
    const skip = (parsedPage - 1) * parsedPerPage;

    const reviewFilters: Prisma.ReviewWhereInput[] = [];

    if (filterBy) {
        reviewFilters.push(
            { movie: { movieName: { contains: filterBy } } },
            { movie: { description: { contains: filterBy } } }
        );
    }

    const reviewSortBy: Prisma.ReviewOrderByWithRelationInput[] = [];

    // if (sortBy) {
    //     reviewSortBy.push({ rating: 'desc' });
    // }
    
    const reviews = await prisma.review.findMany({
        orderBy: reviewSortBy.length ? reviewSortBy : undefined,
        where: {
            OR: reviewFilters.length ? reviewFilters : undefined,
        },
        skip: isNaN(skip) ? undefined : skip,
        take: isNaN(parsedPerPage) ? undefined : parsedPerPage,
    });
    

    if (loggedInUser?.id) {
        reviews.sort((a, b) => {
            const loggedInUserId = Number(loggedInUser.id);
            const reviewUserIdA = Number(a.userId);
            const reviewUserIdB = Number(b.userId);

            if (reviewUserIdA === loggedInUserId && reviewUserIdB !== loggedInUserId) {
                return -1;
            } else if (reviewUserIdA !== loggedInUserId && reviewUserIdB === loggedInUserId) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    return reviews;
};
