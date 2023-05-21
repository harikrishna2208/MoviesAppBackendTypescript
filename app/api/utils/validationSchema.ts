import Joi, { AnySchema } from 'joi';
import joiPassword from 'joi-password';

const signUpSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8)
    .max(32)
    .required()
    .label('Password'),
  confirmPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePassword = Joi.object({
  userId: Joi.number().required(),
  currentPassword: Joi.string().min(8)
    .max(32)
    .required()
    .label('Password'),
  newPassword: Joi.string().min(8)
    .max(32)
    .required()
    .label('Password'),
})

interface Review {
  userId: number;
  movieId: number;
  rating: number;
  comment: string;
}

interface Movie {
  movieName: string;
  description: string;
  directorName: string;
  releaseDate: string;
  reviews?: Review[];
}

const movieSchemaFunction = (requestBody: unknown): Joi.ValidationResult<Movie> => {
  const movieSchema = Joi.object<Movie>({
    movieName: Joi.string().required().label('Movie Name'),
    description: Joi.string().required().label('Description'),
    directorName: Joi.string().required().label('Director Name'),
    releaseDate: Joi.date().required().label('Release Date'),
    reviews: Joi.array().items(Joi.object<Review>({
      userId: Joi.number().required().label('User ID'),
      movieId: Joi.number().required().label('Movie ID'),
      rating: Joi.number().required().label('Rating'),
      comment: Joi.string().required().label('Comment'),
    })).label('Reviews').optional(),
  });

  return movieSchema.validate(requestBody, { abortEarly: false, allowUnknown: true });
};

export const validateReviewInput = (input: Review) => {
  const schema = Joi.object({
    movieId: Joi.number().required(),
    userId: Joi.number().required(),
    rating: Joi.number().required(),
    comment: Joi.string().optional()
  });

  return schema.validate(input, { abortEarly: false, allowUnknown: true });
};

export {
  signUpSchema,
  loginSchema,
  movieSchemaFunction,
  changePassword
};
