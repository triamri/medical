const express = require('express');
const router = express.Router();
const model = require ('../models');
const bcrypt = require('bcrypt');

function checkLogin(req, res, next) {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/dokters/login')
  }
}

router.get('/login', function (req, res) {
  res.render('loginDokter');
});

router.get('/home', checkLogin, function (req, res) {
    res.render('homeDokter');
})

router.get('/', checkLogin ,function (req, res) {
  model.Dokter.findAll({
    order : [['name','ASC']],
    include : [model.Kategori]
  }).then((rows)=> {
    res.render('dokters', {rows : rows})
  }).catch((err) => {
    res.send(err);
  })
})

router.post('/login', function (req, res) {
  model.Logindokter.findOne({
    where : { username : req.body.username }
  }).then(function (dokter) {
    if(dokter) {
      bcrypt.compare(req.body.password, dokter.password).then(function (result) {   
        if (result){
          req.session.loggedIn = true
          req.session.username = dokter.username
          req.session.id = dokter.id
          res.redirect('/dokters/home');
        } else {
          res.redirect('/dokters/login');
        }
      })
    }else{
        res.redirect('/dokters/login');
    }
  }).catch(err => {
    res.redirect('/dokters/login');
  })
})


router.get('/register', function (req, res) {
  model.Kategori.findAll().then(dataKategori => {
    res.render('registerDokter', { dataKategori });
  });
});

router.post('/register', function (req, res) {
  let obj = {
    name: req.body.name,
    alamat: req.body.alamat,
    contact: req.body.contact,
    email: req.body.email,
    KategoriId: req.body.KategoriId
  }
  model.Dokter.create(obj).then(dataId => {
    let objUser = {
      username: req.body.username,
      password: req.body.password,
      DokterId: dataId.id
    }
    model.Logindokter.create(objUser).then((getData) => {
      res.redirect('/dokters/login');
    })
  }).catch((err) => {
    res.send(err);
  });
});

router.get('/schedule/:id', checkLogin, (req,res) => {
  model.Jadwal.findAll({where : {DokterId : req.params.id},
    include : [model.Hari]
  }).then( rows => {
    res.render('schedule',{ rows });
  }).catch(err => {
    res.send(err)
  })
})

router.get('/schedule/:id/input', checkLogin, (req,res) => {
  model.Hari.findAll().then(rows => {
    res.render('addSchedule', {rows})
  }).catch(err => {
    res.send(err)
  })
})

router.post('/schedule/:id/input', checkLogin,(req,res) => {
  model.Jadwal.create(req.body).then(rows => {
    res.redirect('/dokters/schedule/1')
  })
})


router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (!err) {
      res.redirect('/');
    }
  })
});

module.exports = router;