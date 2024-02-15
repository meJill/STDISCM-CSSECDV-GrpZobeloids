dependencies: npm, nodejs, react



1. open a terminal within the root folder 
2. do npm install (to download all node modules needed)
3. run your database server and make sure it is running
4. run database_setup.sql (which is in the root folder) in the sql server that is running to initalize the database within it
5. create config.js in root folder and set database credentials there (host, user, password, database)
follow this format: (note that if you did database script then the database name should be called "test")
module.exports = {
    database: {
        host: 'host',
        user: 'root',
        password: 'password',
        database: 'database name'
    }
};
6. create another config.js file in the src folder and set the google_site_key there
follow this format:
module.exports = {
    google_site_key: 'key'
};
7. use npm run server to run the server
8. use npm start to run the react app
