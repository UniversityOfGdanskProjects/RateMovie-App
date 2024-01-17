import express from "express";
import { 
    registerAdmin, 
    loginAdmin, 
    deleteUser,
    editUser,
    addUser,
    addMovieToFavourites,
    addMovieToIgnored,
    addMovieToWatchlist,
    addMovieToFollowed,
    removeMovieFromFavourites,
    removeMovieFromIgnored,
    removeMovieFromWatchlist,
    removeMovieFromFollowed,
    addComment,
    removeComment,
    editComment,
    addReview,
    removeReview,
    editReview,
    addMovie,
    removeMovie,
    editMovie,
    addMovieFromTMDB,
    getUserById
} from "./controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.route('/api/admin/register').post(registerAdmin);
adminRoutes.route('/api/admin/login').post(loginAdmin);

adminRoutes.route('/api/admin/deleteUser').delete(deleteUser);
adminRoutes.route('/api/admin/editUser').patch(editUser);
adminRoutes.route('/api/admin/addUser').post(addUser);
adminRoutes.route('/api/admin/getUser').get(getUserById)

adminRoutes.route('/api/admin/addMovieToFavourites').post(addMovieToFavourites);
adminRoutes.route('/api/admin/addMovieToIgnored').post(addMovieToIgnored);
adminRoutes.route('/api/admin/addMovieToWatchlist').post(addMovieToWatchlist);
adminRoutes.route('/api/admin/addMovieToFollowed').post(addMovieToFollowed);

adminRoutes.route('/api/admin/removeMovieFromFavourites').delete(removeMovieFromFavourites);
adminRoutes.route('/api/admin/removeMovieFromIgnored').delete(removeMovieFromIgnored);
adminRoutes.route('/api/admin/removeMovieFromWatchlist').delete(removeMovieFromWatchlist);
adminRoutes.route('/api/admin/removeMovieFromFollowed').delete(removeMovieFromFollowed);

adminRoutes.route('/api/admin/addComment').post(addComment);
adminRoutes.route('/api/admin/removeComment').delete(removeComment);
adminRoutes.route('/api/admin/editComment').patch(editComment);

adminRoutes.route('/api/admin/addReview').post(addReview);
adminRoutes.route('/api/admin/removeReview').delete(removeReview);
adminRoutes.route('/api/admin/editReview').patch(editReview);

adminRoutes.route('/api/admin/addMovieFromTMDB').post(addMovieFromTMDB)
adminRoutes.route('/api/admin/addMovie').post(addMovie)
adminRoutes.route('/api/admin/deleteMovie').delete(removeMovie)
adminRoutes.route('/api/admin/editMovie').patch(editMovie)

export default adminRoutes;