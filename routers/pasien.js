const express = require('express');
const router = express.Router();
const model = require ('../models');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: '42ae8010',
  apiSecret: '88f17a1303d6a354'
});

function checkLogin(req, res, next){
  if (req.session.loggedIn) {
    next()
  }else{
    res.redirect('/login')
  }
}


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
  console.log('====================', req.body);
  model.Loginpasien.findOne({
    where : {username : req.body.username}
  }).then(function (pasien) {
    if(pasien) {
      if(pasien.password == req.body.password){
        req.session.loggedIn = true
        req.session.username = pasien.username
        req.session.id = pasien.id
      res.send(pasien)
      }
    }
  }).catch(err => {
    res.redirect('/')
  })
})

router.get('/register', function (req, res) {
    res.render('registerPasien');
});

router.get('/add', (req, res) => {
      res.render('pasienAdd', {err : null});
})

router.post('/add', checkLogin, (req, res) => {
  model.Pasien.create(req.body).then(rows => {
    res.redirect('/pasiens')
  }).catch(err => {
    res.render('pasienAdd', {err})
  })
})

router.get('/edit/:id', checkLogin,(req,res) => {
  // res.send('test')
  model.Pasien.findById(req.params.id).then(rows => {
      res.render('pasienEdit', {rows, err : null });
  }).catch(err => {
    console.log(err);
  })
});

router.post('/edit/:id', checkLogin,(req,res) => {
  model.Pasien.update(req.body,{
    where : {
      id : req.params.id
    }
  }).then(data => {
    res.redirect('/pasiens');
  }).catch(err => {
    model.Pasien.findById(req.params.id).then(rows => {
      // res.send(err)
        res.render('pasienEdit', {rows, err });
    })
  });
})


router.get('/delete/:id', checkLogin,(req, res) => {
  model.Pasien.destroy({
    where: {
      id : req.params.id
    }
  })
  .then(() => {
    res.redirect('/pasiens')
  })
  .catch(err => {
    res.send(err)
  })
})

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

router.get('/rekorbooking', checkLogin,(req, res) => {
  model.Dokter.findAll({where:{PasienId : 1}}).then(rows => {
    res.render('booking', { rows });
    // res.send(rows)
  }).catch(err => {
    res.send(err);
  });
});

router.get('/send', (req, res) => {

});


module.exports = router;
