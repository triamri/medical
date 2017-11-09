const express = require('express');
const router = express.Router();
const model = require ('../models');
const bcrypt = require('bcrypt');


// router.get('/', (req,res) => {
//   res.render('login', {error : false})
// })
//
// router.post('/'){
//   model.Dokter.findOne({
//     where : {req.body.username
//     }
//   }).then(dokter => {
//     if(dokter){
//       bcrypt.compare(req.body.password, model.Dok)
//     }
//   })
// }


module.exports = router;
