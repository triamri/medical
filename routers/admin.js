const express = require('express');
const router = express.Router();
const model = require ('../models');
const bcrypt = require('bcrypt');

function checkLogin(req, res, next) {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}

router.get('/login', function (req, res) {
  res.render('loginadmin');
});

router.get('/home', checkLogin, function (req, res) {
  res.render('homeAdmin');
})

router.get('/dokters', checkLogin ,function (req, res) {
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
  if (req.body.username == 'admin' && req.body.password == 'admin') {   
      req.session.loggedIn = true
      res.redirect('/admin/home');
    } else {
      res.redirect('/admin/login');
    }
 
})

router.get('/dokters/add', checkLogin, (req, res) => {
  model.Kategori.findAll().then(dataKategori => {
      res.render('dokterAdd',{ dataKategori,err:null });
  });
})

router.post('/dokters/add',checkLogin, (req, res) => {
  model.Dokter.create(req.body).then(rows => {
    res.redirect('/admin/dokters')
  }).catch(err => {
    // res.send(err)
    model.Kategori.findAll().then(dataKategori => {
        res.render('dokterAdd',{ dataKategori, err });
    });
  })
  // res.send(req.body);
})

router.get('/dokters/edit/:id',checkLogin, (req,res) => {
  // res.send('test')
  model.Dokter.findById(req.params.id).then(rows => {
    model.Kategori.findAll().then(dataKategori => {
      res.render('dokterEdit', {rows, dataKategori, err: null});
    })
  }).catch(err => {
    console.log(err);
  })
});

router.post('/dokters/edit/:id', checkLogin, (req,res) => {
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

router.get('/dokters/delete/:id', checkLogin, (req,res) => {
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


router.get('/pasiens', checkLogin, function (req, res) {
  model.Pasien.findAll({
    order: [['id', 'ASC']]
  }).then((rows) => {
    res.render('pasiens', { rows: rows })
  }).catch((err) => {
    res.redirect('/admin/pasiens')
  })
})

router.get('/pasiens/add', (req, res) => {
  res.render('pasienAdd', { err: null });
})

router.post('/pasiens/add', checkLogin, (req, res) => {
  model.Pasien.create(req.body).then(rows => {
    res.redirect('/pasiens')
  }).catch(err => {
    res.render('pasienAdd', { err })
  })
})

router.get('/pasiens/edit/:id', checkLogin, (req, res) => {
  // res.send('test')
  model.Pasien.findById(req.params.id).then(rows => {
    res.render('pasienEdit', { rows, err: null });
  }).catch(err => {
    console.log(err);
  })
});

router.post('/pasiens/edit/:id', checkLogin, (req, res) => {
  model.Pasien.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(data => {
    res.redirect('/admin/pasiens');
  }).catch(err => {
    model.Pasien.findById(req.params.id).then(rows => {
      // res.send(err)
      res.render('pasienEdit', { rows, err });
    })
  });
})

router.get('/pasiens/delete/:id', checkLogin, (req, res) => {
  model.Pasien.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.redirect('/admin/pasiens')
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if(!err){
      res.redirect('/');
    }
  })
});

module.exports = router;