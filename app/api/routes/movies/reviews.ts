import express from 'express';
import {
    getReviewsByMovieIdController,
    createReviewController,
    updateReviewController,
    deleteReviewController,
    getAllReview
} from '../../controllers/reviewController';
import * as jwtService from '../../middleware/JWT';

import * as middleware from '../../middleware/validation';

const router = express.Router();


router.get('/allReview', jwtService.verifyAccessToken, getAllReview);

router.get('/:movieId', jwtService.verifyAccessToken, getReviewsByMovieIdController);

router.post('/', jwtService.verifyAccessToken, middleware.reviewDetailsValidation, createReviewController);

router.put('/:reviewId', jwtService.verifyAccessToken, updateReviewController);

router.delete('/:reviewId', jwtService.verifyAccessToken, deleteReviewController);

export default router;
