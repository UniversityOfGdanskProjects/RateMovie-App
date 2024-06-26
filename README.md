## RateMovie

A full stack application based on Letterboxd. It was created using Nextjs, Express, Keycloak and Neo4j. The app allows users to create accounts, leave comments and ratings to different movies.
App includes admin panel which allows to add/edit/delete movies and users. Admin is also allowed to edit and delete comments of users.

## Installation

npm install - in both frontend and backend directories to install dependencies

docker compose up - in main folder to start Neo4j and keycloak containers

npm start - in the backend directory to start the server

npm run dev - in the frontend directory to start the Nextjs frontend, or npm run build and nmp start to build the frontend for production

## Usage

To access regular user funcionalities create new account.
To access regular user and admin functionalities log in using username "admin_rm" and password "Haslo123!!!".

## Enironment Variables

Env files in /frontend and /backend required to start application has been added.

### TMDB_API_KEY

In /frontend/.env TMDB_API_KEY is not declared. If you want to be able to add movies from TMDB you can get the api key here https://www.themoviedb.org/settings/api.
