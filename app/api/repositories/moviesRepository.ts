import { PrismaClient, Movie } from '@prisma/client';
import { CreateMovieRequest } from '../controllers/moviesController';

const prisma = new PrismaClient();

interface MovieInterface extends CreateMovieRequest {
  id: number
}

export const getAllMoviesDetailFromDb = async (sortField: string,
  sortOrder: 'asc' | 'desc',
  filter: string,
  page: number,
  perPage: number) => {
  const skipValue = (page - 1) * perPage;
  const takeValue = perPage

  const movies = await prisma.movie.findMany({
    orderBy: {
      [sortField ?? "movieName"]: sortOrder ?? 'asc',
    },
    where: {
      OR: [
        {
          movieName: {
            contains: filter ?? '',
          },
        },
        {
          description: {
            contains: filter ?? '',
          },
        },
      ],
    },
    skip: isNaN(skipValue) ? 0 : skipValue,
    take: isNaN(takeValue) ? 10 : takeValue,
  });
  return movies;
};

export const saveNewMoviesToDatabase = async (moviesDetails: CreateMovieRequest) => {
  const saveToDb = await prisma.movie.createMany({ data: moviesDetails });
  return saveToDb;
};


export const findMovieById = async (movieId: number): Promise<Movie | null> => {
  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
  });
  return movie;
};


export const updateMoviesInDatabase = async (moviesDetails: MovieInterface[]) => {
  const updateToDB = await Promise.all(
    moviesDetails.map(async (movie) => {
      const updatedMovie = await prisma.movie.update({
        where: { id: movie.id },
        data: {
          movieName: movie.movieName,
          description: movie.description,
          directorName: movie.directorName,
          releaseDate: movie.releaseDate,
        },
      });
      return updatedMovie;
    })
  );
  return updateToDB;
};


export const deleteMoviesDetailsFromDb = async (moviesDetailsId: number[]) => {
  const deleteInDb = await prisma.movie.deleteMany({ where: { id: { in: moviesDetailsId } } });
  return deleteInDb;
};

export const getAllMoviesNameFromDatabase = async () => {
  const movieNames = await prisma.movie.findMany({
    distinct: ['movieName'],
    select: { movieName: true },
  });
  return movieNames.map((movie) => movie.movieName);
};

export const getMovies = async (searchTerm?: string): Promise<Movie[]> => {
  let query

  if (searchTerm) {
    query = prisma.movie.findMany({
      where: {
        OR: [
          { movieName: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    });
  } else {
    query = prisma.movie.findMany();
  }

  return query;
};
