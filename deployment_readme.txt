dependencies: npm, nodejs, react



1. open a terminal within the root folder 
2. do npm install (to download all node modules needed)
3. run your database server and make sure it is running
4. run schema.sql (which is in the root folder) in the sql server that is running to initalize the database within it (May not be needed as code was added to create the 
database if not already there)
5. create config.js in root folder and src folder and set database credentials there (host, user, password, database)
follow this format: (note that if you did database script then the database name should be called "test")
module.exports = {
    database: {
        host: 'host',
        user: 'root',
        password: 'password',
        database: 'database name'
    }
    google_site_key: 'key',
    google_private_key: 'key'
};
6. use npm run server to run the server
7. use npm start to run the react app
