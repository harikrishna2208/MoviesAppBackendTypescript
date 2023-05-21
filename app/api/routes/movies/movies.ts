import express, { Router } from 'express';
import * as moviesController from '../../controllers/moviesController';
import * as jwtService from '../../middleware/JWT';
import { movieDetailsValidation } from '../../middleware/validation';

const moviesRouter: Router = express.Router();

moviesRouter.post(
  '/saveNewMoviesDetails',
  jwtService.verifyAccessToken,
  movieDetailsValidation,
  moviesController.saveNewMovies,
);

moviesRouter.get('/allMoviesDetails', moviesController.getAllMoviesDetails);

moviesRouter.get('/search', moviesController.getMoviesBySearch);

moviesRouter.put('/updateMoviesDetails', jwtService.verifyAccessToken, moviesController.updateMoviesDetails);

moviesRouter.delete('/deleteMoviesDetails', jwtService.verifyAccessToken, moviesController.deleteMovieDetails);

export default moviesRouter;

