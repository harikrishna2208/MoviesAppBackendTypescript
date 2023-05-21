import express, { Router, Request, Response, NextFunction } from 'express';
import * as jwtService from '../middleware/JWT';
import userRoute from './movies/userRoute';
import moviesRoute from './movies/movies';
import review from "./movies/reviews"

const router: Router = express.Router();

router.use('/user', userRoute); // user details
router.use('/movies', moviesRoute);
router.use('/token', jwtService.verifyAccessToken); // For development
router.use('/review', review);
router.use('/refreshToken', jwtService.generateTokens);

router.use('/logout', jwtService.logoutUser);

router.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error('Not Found || No route');
  error.status = 404;
  next(error);
});

// eslint-disable-next-line no-unused-vars
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

export default router;
