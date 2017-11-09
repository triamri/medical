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
          req.session.idpasien = JSON.stringify(pasien.PasienId);
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

router.get('/profile', checkLogin, (req,res) => {
  // res.send('test')
  model.Pasien.findById(req.session.idpasien).then(rows => {
    // res.send(req.session.idpasien)
      res.render('profilePasien', {rows, err : null });
  }).catch(err => {
    res.send(err);
  });
});

router.get('/profile/edit', checkLogin, (req,res) => {
  // res.send('test')
  model.Pasien.findById(req.session.idpasien).then(rows => {
    res.render('pasienEditprofile', {rows, err : null });
  }).catch(err => {
    console.log(err);
  })
});

router.post('/profile/edit', checkLogin,(req,res) => {//postnya belum nih
  model.Pasien.update(req.body,{
    where : {
      id : req.session.idpasien
    }
  }).then(data => {
    res.redirect('/pasiens/profile');
  }).catch(err => {
    model.Pasien.findById(req.session).then(rows => {
      // res.send(err)
      res.render('pasienEditprofile', {rows, err });
    })
  });
})


router.get('/home', checkLogin,(req,res) => {
  // res.send('Hello World')
  // res.send('test')
  model.Pasien.findById(req.session.idpasien).then(rows => {
    // res.send(req.session.idpasien)
      res.render('pasienEdit', {rows, err : null });
  }).catch(err => {
    console.log(err);
  })
});

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
          PasienId: req.session.idpasien,
        }
        model.Booking.create(Obj).then((rows) => {
          res.redirect('/pasiens/rekorbooking');
        });
      }
    }
  );
});

router.get('/rekorbooking', checkLogin, (req, res) => {
  model.Booking.findAll({
    where: { PasienId: req.session.idpasien},
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