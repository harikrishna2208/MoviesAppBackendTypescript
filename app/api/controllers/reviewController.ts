import { Request, Response } from 'express';
import { createReview, getReviewsByMovieId, updateReview, deleteReview, getAllReviews } from '../services/reviewService';
import * as appResponse from './../utils/AppResponse';

export const getAllReview = async (req: Request, res: Response) => {
    const { sortBy, filterBy, page, perPage, loggedInUserId } = req.query;
    try {
        const reviews = await getAllReviews(sortBy as string,
            filterBy as string,
            page as string,
            perPage as string,
            res.locals.email as string
        );
        return appResponse.success(res, 'Reviews fetched successfully', { reviews });
    } catch (error) {
        console.log(error);
        return appResponse.internalServerError(res, 'Failed to fetch reviews');
    }
};

export const getReviewsByMovieIdController = async (req: Request, res: Response) => {
    const { movieId } = req.params;
    try {
        const reviews = await getReviewsByMovieId(parseInt(movieId));
        return appResponse.success(res, 'Reviews fetched successfully', { reviews });
    } catch (error) {
        console.log(error)
        return appResponse.internalServerError(res, 'Failed to fetch reviews');
    }
};

export const createReviewController = async (req: Request, res: Response) => {
    const { movieId, userId, rating, comment } = req.body;
    try {
        const review = await createReview(parseInt(movieId), parseInt(userId), rating, comment);
        return appResponse.created(res, 'Review created successfully', { review });
    } catch (error) {
        console.log(error)
        return appResponse.internalServerError(res, 'Failed to create review');
    }
};

export const updateReviewController = async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    try {
        const updatedReview = await updateReview(parseInt(reviewId), rating, comment);
        return appResponse.success(res, 'Review updated successfully', { updatedReview });
    } catch (error) {
        return appResponse.internalServerError(res, 'Failed to update review');
    }
};

export const deleteReviewController = async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    try {
        await deleteReview(parseInt(reviewId));
        return appResponse.success(res, 'Review deleted successfully');
    } catch (error) {
        return appResponse.internalServerError(res, 'Failed to delete review');
    }
};
