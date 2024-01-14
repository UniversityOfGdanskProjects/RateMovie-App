import { getMoviesByRelation, getRelationByMovieAndUser } from '../../helpers/movieHelpers.js';
import driver from "../../db/neo4jDriver.js";

export const getFavouriteMovies = async (req, res) => {
    await getMoviesByRelation(req, res, 'FAVOURITES');
};

export const getWatchlistMovies = async (req, res) => {
    await getMoviesByRelation(req, res, 'ADDED_TO_WATCHLIST');
};

export const getIgnoredMovies = async (req, res) => {
    await getMoviesByRelation(req, res, 'IGNORES');
};

export const getFollowedMovies = async (req, res) => {
    await getMoviesByRelation(req, res, 'FOLLOWED');
};

export const getCommentedMovies = async (req, res) => {
    await getMoviesByRelation(req, res, 'COMMENTED');
};

export const getReviewedMovies = async (req, res) => {
    await getMoviesByRelation(req, res, 'REVIEWED');
};

export const getReviewByMovieAndUser = async (req, res) => {
    await getRelationByMovieAndUser(req, res, 'REVIEWED');
}

export const getFavouriteByMovieAndUser = async (req, res) => {
    await getRelationByMovieAndUser(req, res, 'FAVOURITES');
}

export const getIgnoredByMovieAndUser = async (req, res) => {
    await getRelationByMovieAndUser(req, res, 'IGNORES');
}

export const getFollowedByMovieAndUser = async (req, res) => {
    await getRelationByMovieAndUser(req, res, 'FOLLOWED');
}

export const getWathlistByMovieAndUser = async (req, res) => {
    await getRelationByMovieAndUser(req, res, 'ADDED_TO_WATCHLIST');
}