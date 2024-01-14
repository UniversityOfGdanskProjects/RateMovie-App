import express from 'express';
import { getFavouriteMovies, 
    getWatchlistMovies, 
    getIgnoredMovies, 
    getFollowedMovies,
    getCommentedMovies,
    getReviewedMovies,
    getReviewByMovieAndUser,
    getFavouriteByMovieAndUser,
    getIgnoredByMovieAndUser,
    getFollowedByMovieAndUser,
    getWathlistByMovieAndUser
 } from './controllers/userDataController.js';

const userDataRoutes = express.Router();

userDataRoutes.get('/api/favourites/:userId', getFavouriteMovies);
userDataRoutes.get('/api/watchlist/:userId', getWatchlistMovies);
userDataRoutes.get('/api/ignored/:userId', getIgnoredMovies);
userDataRoutes.get('/api/followed/:userId', getFollowedMovies);
userDataRoutes.get('/api/commented/:userId', getCommentedMovies);
userDataRoutes.get('/api/reviewed/:userId', getReviewedMovies);

userDataRoutes.get('/api/review/:userId/:movieId', getReviewByMovieAndUser);
userDataRoutes.get('/api/favourite/:userId/:movieId', getFavouriteByMovieAndUser);
userDataRoutes.get('/api/ignored/:userId/:movieId', getIgnoredByMovieAndUser);
userDataRoutes.get('/api/followed/:userId/:movieId', getFollowedByMovieAndUser);
userDataRoutes.get('/api/watchlist/:userId/:movieId', getWathlistByMovieAndUser)

export default userDataRoutes;