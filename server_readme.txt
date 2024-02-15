do npm install (sql and stuff needed)
make sure that your server is running
run database_setup.sql in the sql server that is running to initalize database (basic one rn) (here for now might be sus security wise)
create config.js in root folder and set database credentials there (host, user, password, database)
follow this format: (note that if you did database script then the database name should be 'test')
module.exports = {
    database: {
        host: 'host',
        user: 'root',
        password: 'password',
        database: 'database name'
    }
};
use npm start to run react app
use npm run server to run server