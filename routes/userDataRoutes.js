import express from 'express';
import { getFavouriteMovies, 
    getWatchlistMovies, 
    getIgnoredMovies, 
    getFollowedMovies,
    getCommentedMovies,
    getReviewedMovies,
    getReviewByMovieAndUser
 } from './controllers/userDataController.js';

const userDataRoutes = express.Router();

userDataRoutes.get('/api/favourites', getFavouriteMovies);
userDataRoutes.get('/api/watchlist', getWatchlistMovies);
userDataRoutes.get('/api/ignored', getIgnoredMovies);
userDataRoutes.get('/api/followed', getFollowedMovies);
userDataRoutes.get('/api/commented', getCommentedMovies);
userDataRoutes.get('/api/reviewed', getReviewedMovies);
userDataRoutes.get('/api/review', getReviewByMovieAndUser);

export default userDataRoutes;