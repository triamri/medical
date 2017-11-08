const express = require('express');
const router = express.Router();
const model = require ('../models');

router.get('/', function (req, res) {
  model.Dokter.findAll({
    order : [['name','ASC']],
    include : [model.Kategori]
  }).then((rows)=> {
    res.render('dokters', {rows : rows})
  }).catch((err) => {
    res.redirect("dokters")
  })
})

router.get('/add', (req, res) => {
  model.Kategori.findAll().then(dataKategori => {
      res.render('dokterAdd',{ dataKategori });
  });
})

router.post('/add', (req, res) => {
  model.Dokter.create(req.body).then(rows => {
    res.redirect('/dokters')
  }).catch(err => {
    res.send(err);
  })
  // res.send(req.body);
})

router.get('/edit/:id', (req,res) => {
  // res.send('test')
  model.Dokter.findById(req.params.id).then(rows => {
    model.Kategori.findAll().then(dataKategori => {
      res.render('dokterEdit', {rows,dataKategori});
    })
  }).catch(err => {
    console.log(err);
  })
});

router.post('/edit/:id', (req,res) => {
  model.Dokter.update(req.body,{
    where : {
      id : req.params.id
    }
  }).then(data => {
    res.redirect('/dokters');
  }).catch(err => {
    res.send(err);
  });
})

router.get('/delete/:id', (req,res) => {
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

router.get('/schedule/:id', (req,res) => {
  model.Jadwal.findAll({where : {DokterId : req.params.id},
    include : [model.Hari]
  }).then( rows => {
    res.render('schedule',{ rows });
  }).catch(err => {
    res.send(err)
  })
})

router.get('/schedule/:id/input', (req,res) => {
  model.Hari.findAll().then(rows => {
    res.render('addSchedule', {rows})
  }).catch(err => {
    res.send(err)
  })
})

router.post('/schedule/:id/input', (req,res) => {
  model.Jadwal.create(req.body).then(rows => {
    res.redirect('/dokters/schedule/1')
  })
})








module.exports = router;
