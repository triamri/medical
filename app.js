const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
const session    = require('express-session');

app.use(session({
  secret: 'express'
}))

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/css', express.static(__dirname + '/css'));
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/js', express.static(__dirname + '/js'));

//halaman home
const index = require('./routers/index');
app.use('/', index);

//halaman pasien
const pasien = require('./routers/pasien');
app.use('/pasiens', pasien);

//halaman dokter
const dokter = require('./routers/dokter');
app.use('/dokters', dokter);

const admin = require('./routers/admin');
app.use('/admin', admin)

app.listen(3000,function(){
    console.log('go medical');
});
