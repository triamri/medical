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
          req.session.idDokter = JSON.stringify(dokter.DokterId);
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

router.get('/profile', (req,res) => {
  // res.send('test')
  model.Dokter.findById(req.session.idDokter, {include : [model.Kategori]}).then(rows => {
      // res.send(rows)
      res.render('profileDokter', {rows, err : null });
  }).catch(err => {
    res.redirect("/profile");
  });
});
//
// model.Dokter.findAll({
//   order : [['name','ASC']],
//   include : [model.Kategori]
// }).then((rows)=> {
//   res.render('dokters', {rows : rows})
// }).catch((err) => {
//   res.redirect("dokters")
// })

router.get('/profile/edit', (req,res) => {
  // res.send('test')
  model.Dokter.findById(req.session.idDokter).then(rows => {
    model.Kategori.findAll().then(dataKategori => {
      // res.send(dataKategori)
      res.render('dokterEditprofile', {rows, dataKategori, err: null});
    })
  }).catch(err => {
    console.log(err);
  })
});

router.post('/profile/edit',(req,res) => {//postnya belum nih
  model.Dokter.update(req.body,{
    where : {
      id : req.session.idDokter
    }
  }).then(data => {
    res.redirect('/dokters/profile');
  }).catch(err => {
    model.Dokter.findById(req.session).then(rows => {
      // res.send(err)
      res.render('dokterEditprofile', {rows, err });
    })
  });
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

router.get('/schedule', checkLogin, (req,res) => {
  model.Jadwal.findAll({
    where: { DokterId: req.session.idDokter},
    include : [model.Hari]
  }).then( rows => {
    res.render('schedule',{ rows });
  }).catch(err => {
    res.send(err)
  })
})

router.get('/schedule/input', checkLogin, (req,res) => {
  model.Hari.findAll().then(rows => {
    res.render('addSchedule', {rows})
  }).catch(err => {
    res.send(err)
  })
})

router.post('/schedule/input', checkLogin,(req,res) => {
  let obj = {
    jambuka: req.body.jambuka,
    jamtutup: req.body.jamtutup,
    DokterId: req.session.idDokter,
    HariId: req.body.HariId
  }
  model.Jadwal.create(obj).then(rows => {
    res.redirect('/dokters/schedule')
  })
})

router.get('/schedule/edit/:id', checkLogin, (req, res) => {
  model.Jadwal.findById(req.params.id).then(rows => {
    model.Hari.findAll().then((dataHari) => {
      res.render('editSchedule', { rows, dataHari })
    })    
  }).catch(err => {
    res.send(err)
  })
})

router.post('/schedule/edit/:id', checkLogin, (req, res) => {
  model.Jadwal.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(rows => {
    
      res.redirect('/dokters/schedule')
    
  }).catch(err => {
    res.send(err)
  })
})

router.get('/schedule/delete/:id', checkLogin, (req, res) => {
  model.Jadwal.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.redirect('/dokters/schedule')
    })
    .catch(err => {
      res.send(err)
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