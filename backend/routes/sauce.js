const express = require('express');
const router = express.Router();

const Saucectrl = require ('../controllers/sauce');
const multer = require ('../middleware/multer-config');
 const auth = require ('../middleware/auth'); 


  

router.get('/' ,auth, Saucectrl.Recuperation_Toutes_Sauce);

router.post('/' ,auth, multer, Saucectrl.CreationSauce); 

router.get('/:id' ,auth, Saucectrl.Recuperation_une_Sauce);
 
router.put('/:id',auth, multer,Saucectrl.ModificationSauce);
    
router.delete('/:id',auth, Saucectrl.SupressionSauce);
    



  

  module.exports = router;