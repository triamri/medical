const express = require('express');
const router = express.Router();
const model = require ('../models');

router.get('/home', function (req, res) {
    res.render('homeDokter');
})

router.get('/', checkLogin ,function (req, res) {
  model.Dokter.findAll({
    order : [['name','ASC']],
    include : [model.Kategori]
  }).then((rows)=> {
    res.render('dokters', {rows : rows})
  }).catch((err) => {
    res.redirect("dokters")
  })
})

function checkLogin(req, res, next){
  if (req.session.loggedIn) {
    next()
  }else{
    res.redirect('/login')
  }
}


router.get('/login', function (req, res) {
  res.render('loginDokter');
});

router.post('/login', function (req, res) {
  console.log('====================', req.body);
  model.Logindokter.findOne({
    where : {username : req.body.username}
  }).then(function (dokter) {
    if(dokter) {
      if(dokter.password == req.body.password){
        req.session.loggedIn = true
        req.session.username = dokter.username
        req.session.id = dokter.id
      res.send(dokter)
      }
    }
  }).catch(err => {
    res.redirect('/')
  })
})


router.get('/register', function (req, res) {
  model.Kategori.findAll().then(dataKategori => {
    res.render('registerDokter', { dataKategori });
  });
});

router.get('/add', checkLogin, (req, res) => {
  model.Kategori.findAll().then(dataKategori => {
      res.render('dokterAdd',{ dataKategori,err:null });
  });
})

router.post('/add',checkLogin, (req, res) => {
  model.Dokter.create(req.body).then(rows => {
    res.redirect('/dokters')
  }).catch(err => {
    // res.send(err)
    model.Kategori.findAll().then(dataKategori => {
        res.render('dokterAdd',{ dataKategori, err });
    });
  })
  // res.send(req.body);
})

router.get('/edit/:id',checkLogin, (req,res) => {
  // res.send('test')
  model.Dokter.findById(req.params.id).then(rows => {
    model.Kategori.findAll().then(dataKategori => {
      res.render('dokterEdit', {rows, dataKategori, err: null});
    })
  }).catch(err => {
    console.log(err);
  })
});

router.post('/edit/:id', checkLogin, (req,res) => {
  model.Dokter.update(req.body,{
    where : {
      id : req.params.id
    }
  }).then(data => {
    res.redirect('/dokters');
  }).catch(err => {
    // res.send(err)
    model.Dokter.findById(req.params.id).then(rows => {
      model.Kategori.findAll().then(dataKategori => {
        res.render('dokterEdit', {rows, dataKategori,err});
      })
    })
  })
})

router.get('/delete/:id', checkLogin, (req,res) => {
  model.Dokter.destroy({
    where : {
      id : req.params.id
    }
  }).then(() => {
    res.redirect('/dokters')
  }).catch(err => {
    res.send(err);
  })
})

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

module.exports = router;