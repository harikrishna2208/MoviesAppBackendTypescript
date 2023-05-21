import { Movie } from '@prisma/client';
import * as moviesRepository from '../repositories/moviesRepository';
import { CreateMovieRequest } from '../controllers/moviesController';



export async function getAllMoviesFromDb(
  sortField: string,
  sortOrder: 'asc' | 'desc',
  filter: string,
  page: number,
  perPage: number
) {
  try {
    const movies = await moviesRepository.getAllMoviesDetailFromDb(sortField, sortOrder, filter, page, perPage);
    return movies;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch movies');
  };
}


export async function saveNewMoviesDetailsToDatabase(moviesDetails: CreateMovieRequest) {
  const saveMovieDetails = await moviesRepository.saveNewMoviesToDatabase(moviesDetails);
  return saveMovieDetails;
}

export async function updateMovieDetailsInDatabase(moviesDetails: any) {
  const updatedMovies = await moviesRepository.updateMoviesInDatabase(moviesDetails);
  return updatedMovies;
}



export const getMovieById = async (movieId: number): Promise<Movie | null> => {
  const movie = await moviesRepository.findMovieById(movieId);
  return movie;
};


export async function deleteMoviesDetailFromDb(moviesId: any) {
  const deletedMovie = await moviesRepository.deleteMoviesDetailsFromDb(moviesId);
  return deletedMovie;
}

export async function getAllMoviesNameFromDb() {
  const allMovieName = await moviesRepository.getAllMoviesNameFromDatabase();
  return allMovieName;
}


export const getMoviesService = async (searchTerm?: string): Promise<Movie[]> => {
  try {
    const movies = await moviesRepository.getMovies(searchTerm);
    return movies;
  } catch (error) {
    throw new Error('Failed to fetch movies');
  }
};
