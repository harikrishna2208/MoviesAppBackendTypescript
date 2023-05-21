import { Request, Response, NextFunction } from 'express';
import { signUpSchema, loginSchema, movieSchemaFunction, validateReviewInput, changePassword as chnagePasswordSchema } from '../utils/validationSchema';
import * as appResponse from '../utils/AppResponse';
import constants from '../utils/constants';
import logger from './logger';
import { getAllMoviesNameFromDb } from '../services/movieService';

const signUpValidation = (req: Request, res: Response, next: NextFunction): void => {
  // validate the req.body to pass certain criteria.
  const result = signUpSchema.validate(req.body);
  const { error } = result; // check whether error exist from validation
  const valid = error == null;
  if (!valid) {
    logger.info(error);
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: error.message });
  }
  next();
};

const loginValidation = (req: Request, res: Response, next: NextFunction): void => {
  const result = loginSchema.validate(req.body);
  const { error } = result;
  const valid = error == null;
  if (!valid) {
    logger.info(error);
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: error.message });
  }
  next();
};

const changePassword = (req: Request, res: Response, next: NextFunction): void => {
  const result = chnagePasswordSchema.validate(req.body);
  const { error } = result;
  const valid = error == null;
  if (!valid) {
    logger.info(error);
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: error.message });
  }
  next();
};

const movieDetailsValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const result = movieSchemaFunction(req.body);
  const { error } = result;
  const valid = error == null;
  if (!valid) {
    logger.info(error);

    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: error.message });
  }
  next();
};

const reviewDetailsValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const result = validateReviewInput(req.body);
  const { error } = result;
  const valid = error == null;
  if (!valid) {
    logger.info(error);
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: error.message });
  }
  next();
};

export {
  signUpValidation,
  loginValidation,
  movieDetailsValidation,
  reviewDetailsValidation,
  changePassword
};
