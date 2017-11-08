const express = require('express');
const router = express.Router();
const model = require ('../models');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: '42ae8010',
  apiSecret: '88f17a1303d6a354'
});

router.get('/', function (req, res) {
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

router.get('/register', function (req, res) {
    res.render('registerPasien');
});

router.get('/add', (req, res) => {
      res.render('pasienAdd');
})

router.post('/add', (req, res) => {
  model.Pasien.create(req.body).then(rows => {
    res.redirect('/pasiens')
  }).catch(err => {
    res.send(err);
  })
  // res.send(req.body);
})

router.get('/edit/:id', (req,res) => {
  // res.send('test')
  model.Pasien.findById(req.params.id).then(rows => {
      res.render('pasienEdit', { rows });
  }).catch(err => {
    console.log(err);
  })
});

router.post('/edit/:id', (req,res) => {
  model.Pasien.update(req.body,{
    where : {
      id : req.params.id
    }
  }).then(data => {
    res.redirect('/pasiens');
  }).catch(err => {
    res.send(err);
  });
})


router.get('/delete/:id', (req, res) => {
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

router.get('/booking', (req, res) => {
  model.Dokter.findAll({include:model.Kategori}).then(rows => {
    res.render('booking', { rows });
    // res.send(rows)
  }).catch(err => {
    res.send(err);
  });
});

router.get('/addbooking/:id', (req, res) => {
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

router.get('/getbooking', (req, res) => {
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

router.get('/rekorbooking', (req, res) => {
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
