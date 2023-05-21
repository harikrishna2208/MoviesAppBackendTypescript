import { Request, Response } from 'express';
import * as moviesService from '../services/movieService';
import constants from '../utils/constants';
import * as appResponse from '../utils/AppResponse';
import logger from '../middleware/logger';



export interface Review {
  id: number;
  movieId: number;
  userId: number;
  rating: number;
  comment: string;
}

export interface CreateMovieRequest {
  movieName: string;
  description: string;
  directorName: string;
  releaseDate: Date;
  reviews: Review[];
}

export const getMovieByIdController = async (req: Request, res: Response): Promise<void> => {
  const { movieId } = req.params;

  try {
    const parsedMovieId = parseInt(movieId, 10);
    const movie = await moviesService.getMovieById(parsedMovieId);
    if (!movie) {
      return appResponse.notFound(res, 'Movie not found');
    }
    return appResponse.success(res, 'Movie found', movie);
  } catch (error) {
    console.error(error);
    return appResponse.internalServerError(res, 'An error occurred');
  }
};



export const getAllMoviesDetails = async (req: Request, res: Response) => {

  const { sortField, sortOrder, filter, page, perPage } = req.query;
  try {
    const movies = await moviesService.getAllMoviesFromDb(
      sortField as string,
      sortOrder as 'asc' | 'desc',
      filter as string,
      parseInt(page as string),
      parseInt(perPage as string)
    );
    return appResponse.success(res, 'Movies fetched successfully', { movies });
  } catch (error) {
    console.log(error);
    return appResponse.internalServerError(res, 'Failed to fetch movies');

  };
}



export const saveNewMovies = async (req: Request<{}, {}, CreateMovieRequest>, res: Response) => {
  try {
    const movieDetails = req.body;
    const saveMovieDetails = await moviesService.saveNewMoviesDetailsToDatabase(movieDetails);
    if (!saveMovieDetails) return appResponse.conflict(res, constants.DATA_NOT_SAVED);
    return appResponse.created(res, constants.INSERTED_SUCCESSFULLY);
  } catch (error) {
    logger.error(error);
    return appResponse.internalServerError(res, constants.DATA_NOT_SAVED);
  }
};

export const updateMoviesDetails = async (req: Request, res: Response) => {
  try {
    const movieDetails = req.body;
    const updateMovieDetails = await moviesService.updateMovieDetailsInDatabase(movieDetails);
    if (!updateMovieDetails) return appResponse.conflict(res, constants.UPDATE_FAIL);
    return appResponse.success(res, constants.DATA_UPDATED, updateMovieDetails);
  } catch (error) {
    logger.error(error);
    return appResponse.internalServerError(res, constants.DATA_NOT_SAVED);
  }
};

export const deleteMovieDetails = async (req: Request, res: Response) => {
  try {
    const movieDetails = req.body;
    const deleteMovieDetail = await moviesService.deleteMoviesDetailFromDb(movieDetails.id);
    if (!deleteMovieDetail) return appResponse.conflict(res, constants.DATA_NOT_SAVED);
    return appResponse.success(res, constants.DELETE_SUCCESSFUL);
  } catch (error) {
    logger.error(error);
    return appResponse.internalServerError(res, constants.DATA_NOT_SAVED);
  }
};

export const getAllMovieNamesFromDatabase = async (req: Request, res: Response) => {
  try {
    const allMoviesDetails = await moviesService.getAllMoviesNameFromDb();
    if (!allMoviesDetails) return appResponse.conflict(res, constants.NO_RECORD_FOUND);
    return appResponse.success(res, constants.SUCCESSFULLY_FETCHED, allMoviesDetails);
  } catch (error) {
    logger.error(error);
    return appResponse.internalServerError(res, constants.DATA_NOT_SAVED);
  }
};

export const getMoviesBySearch = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;

  try {
    const movies = await moviesService.getMoviesService(searchTerm as string);
    return appResponse.success(res, 'Movies fetched successfully', { movies });
  } catch (error) {
    return appResponse.internalServerError(res, 'Failed to fetch movies');
  }
};

