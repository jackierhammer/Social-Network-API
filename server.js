// import statements
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

// sets up express and selects port 3001 to run on
const PORT = process.env.PORT || 3001;
const app = express();

// sets up express and api routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// starts the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
