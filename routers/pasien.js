const express = require('express');
const router = express.Router();
const model = require ('../models');
const bcrypt = require('bcrypt');
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '42ae8010',
  apiSecret: '88f17a1303d6a354'
});

function checkLogin(req, res, next){
  if (req.session.loggedIn) {
    next()
  }else{
    res.redirect('/pasiens/login')
  }
}

router.get('/home', checkLogin, function (req, res) {
  res.render('homePasien');
})

router.get('/', checkLogin, function (req, res) {
  model.Pasien.findAll({
    order : [['id','ASC']]
  }).then((rows)=> {
    res.render('pasiens', {rows : rows})
  }).catch((err) => {
    res.redirect('/pasiens')
  })
})

router.get('/login', function (req, res) {

  res.render('loginPasien');

});

router.post('/login', function (req, res) {
  model.Loginpasien.findOne({
    where : { username : req.body.username }
  }).then(function (pasien) {
    if(pasien) {
      bcrypt.compare(req.body.password, pasien.password).then(function (result) {
        if (result) {
          req.session.loggedIn = true;
          req.session.username = pasien.username;
          req.session.id = pasien.id;
          res.redirect('/pasiens/home');
        } else {
          res.redirect('/pasiens/login');
        }
      })
    } else {
      res.redirect('/pasiens/login');
    }
  }).catch(err => {
    res.redirect('/pasiens/login');
  })
})

router.get('/register', function (req, res) {
    res.render('registerPasien');
});

router.post('/register', function (req, res) {
  let obj = {
    name: req.body.name,
    contact: req.body.contact,
    email: req.body.email
  }
  model.Pasien.create(obj).then(dataId => {
    let objUser = {
      username: req.body.username,
      password: req.body.password,
      PasienId: dataId.id
    }
    model.Loginpasien.create(objUser).then((getData) => {
      res.redirect('/pasiens/login');
    })
  }).catch((err) => {
    res.send(err);
  });
});

router.get('/booking', checkLogin,(req, res) => {
  model.Dokter.findAll({include:model.Kategori}).then(rows => {
    res.render('booking', { rows });
    // res.send(rows)
  }).catch(err => {
    res.send(err);
  });
});

router.get('/addbooking/:id', checkLogin,(req, res) => {
  model.Dokter.findById(req.params.id, {
    include: [{
      model: model.Jadwal, include: {
        model: model.Hari
      }
    }]
  }).then(rows => {
    res.render('getBooking', { rows });
    // res.send(rows)
  }).catch(err => {
    res.send(err);
  });
});

router.get('/getbooking', checkLogin,(req, res) => {
  nexmo.message.sendSms(
    'Nexmo', req.query.contact, `Booking Jadwal Hari ${req.query.hari}`,
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        let Obj = {
          JadwalId : req.query.idjadwal,
          PasienId : 1,
        }
        model.Booking.create(Obj).then((rows) => {
          res.redirect('/rekorbooking');
        });
      }
    }
  );
});

router.get('/rekorbooking', checkLogin, (req, res) => {
  model.Booking.findAll({where:{PasienId : 1},
    include:[{
      model: model.Jadwal,include:[
        model.Hari, model.Dokter
      ]
    }]
  }).then(rows => {
    res.render('rekorbooking', { rows });
  }).catch(err => {
    res.send(err);
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (!err) {
      res.redirect('/');
    }
  })
});


module.exports = router;