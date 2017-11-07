const express = require('express');
const router = express.Router();
const model = require ('../models');

router.get('/', function (req, res) {
  model.Pasien.findAll({
    order : [['id','ASC']]
  }).then((rows)=> {
    res.render('pasiens', {rows : rows})
  }).catch((err) => {
    res.redirect('/pasiens')
  })
})

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


module.exports = router;
