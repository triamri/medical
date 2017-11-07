const express    = require('express');
const bodyParser = require('body-parser');
const app  = express();

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'ejs');

//halaman home
const index = require('./routers/index');
app.use('/', index);

//halaman pasien
const pasien = require('./routers/pasien');
app.use('/pasiens', pasien);

//halaman dokter
const dokter = require('./routers/dokter');
app.use('/dokters', dokter);


app.listen(3000,function(){
    console.log('go medical');
});