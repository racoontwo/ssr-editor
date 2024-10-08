# SSR Editor

Starter project for DV1677 JSRamverk

## Description

This is our project for the course "JavaScript-baserade ramverk" at Blekinge Tekniska Högskola.
The aim of the project is to build a fully functional SSR editor while practicing on using a JavaScript framework.

### How we got the application to run

We got the application to run by following steps:

1. Add a .env file and install the npm dotenv package in order to be able to manage environment variables.
2. Set a port on which the application is to run on, we chose port 3000.

The application was now running but we found that there were som SQLite-errors. We found that where was a bash script for resetting the database which we tried to use but i didn't work properly. This was fixed by updating the paths to the affected files and after a reset of the database the errors were solved.

### Changes made to make the app running

Scrolling through the application we identified it was lacking a form to create a document as well as a route to perform the update interaction with the database.

First we created a form for creating a document. Once we had this running we could continue with the routing for the update-module and the connection with the database. After experimenting with different ways to get a specific document to update, we opted to go with rowid. However, after implementing this we came to the realization that the created_at variable could work as well.

## Framework

We have chosen to use React for this project. The reasoning behind this is that React is one of the most commonly used frameworks for JavaScript right now and it is in high demand on the labor market, which makes us believe that it is a valuable knowledge to get.
