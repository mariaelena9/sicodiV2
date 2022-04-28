const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
app.use(cors());

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

app.use(bodyParser.json({limit: '50mb'}));

const fileUpload = require("express-fileupload");
app.use(fileUpload());
const serveIndex = require('serve-index');
app.use(express.static(__dirname + "/"))
app.use('/pdf', serveIndex('pdf')); // shows you the file list
app.use('/pdf', express.static('pdf')); 
  

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api/user', require('./routes/usersRoute'));
app.use('/api/email', require('./routes/mailRoute'));
app.use('/api/dependences', require('./routes/dependencesRoute'));
app.use('/api/correspondence', require('./routes/correspondenciaRoute'));
app.use('/api/tracking', require('./routes/trackingRoute'));



app.listen(app.get('port'), () => {
    console.log(`servidor en puerto ${3000}`);
});