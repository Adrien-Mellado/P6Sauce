/* mise en place de express */
const express = require('express');
const bodyParser = require('body-parser');

/* importez mongoose */
const mongoose = require('mongoose');

/*importer dotenv*/
const dotenv = require("dotenv");
dotenv.config();


const app = express();
const path = require ('path');


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});


app.use(express.json());

/* connection a mongoose */ 
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fmg4k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));






app.use('/images', express.static(path.join(__dirname, 'images')));


/**
 * instanciate routers
 */
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

/**
 * set up routes
 */
app.use('/api/sauces',  sauceRoutes);
app.use('/api/auth',  userRoutes);




/* exporter express */ 
module.exports = app ;