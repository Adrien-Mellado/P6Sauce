const Sauce = require ('../models/Sauce');


exports.CreationSauce =  (req, res, next) => {

    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;

    const sauce = new Sauce({

      ...sauceObjet,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(200).json({ message: 'Objet enregistré !'}))
    .catch(error =>res.status(400).json({ error }));
  };

  exports.ModificationSauce = (req, res, next) => {
    const sauceObjet = req.file? 
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };


  exports.SupressionSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ erreur: error }));
  };

  exports.Recuperation_une_Sauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({ error }));
  };


  exports.Recuperation_Toutes_Sauce = (req, res, next) => {
    Sauce.find()
        .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({ error }));
};


// function Donne_likes_dislikes ( user , usersDisliked , usersLiked , like , sauceId){
//   user = rereq.body.userId;
//   like =  parseInt(req.body.like);
//   sauceId = req.params.id;
 
// }




exports.likes_Dislike = (req , res , next) => {
   let Like = parseInt(req.body.like);
   let userId = req.body.userId;
   let sauceId = req.params.id;

   


  Sauce.findOne({_id: sauceId}) .then ((sauce) => {

    
     if (Like === 1)  {
        Sauce.updateOne({_id: sauceId},  { $push: {usersLiked : userId}, $inc: {likes: +1}})
        .then(() => res.status(200).json({ message: 'A liké'}) )
      .catch(error =>res.status(400).json({ error }));

    } 
  
 
   if (Like === -1 ) {
     

     Sauce.updateOne({_id: sauceId},  { $push : {usersDisliked : userId}, $inc: {dislikes: +1}})
     .then(() => res.status(200).json({ message: 'A disliké'}))
     .catch(error =>res.status(400).json({ error }));
    
     

   } 

  
 

 if (Like === 0 ) {
  const ind = sauce.usersLiked.indexOf(userId);
  if ( ind > -1) {
    sauce.usersLiked.slice(ind , 1);
    Sauce.updateOne({_id: sauceId}, {$push: { usersLiked: {$each: [ ], $slice: ind}}, $inc: { likes: -1 }})
    .then(() => res.status(200).json({ message: 'A disliké'}))
     .catch(error =>res.status(400).json({ error }))
  }
  else if (ind === -1) {
    const indDisliked = sauce.usersDisliked.indexOf(userId);
    sauce.usersDisliked.slice(indDisliked, 1);
    Sauce.updateOne({ _id: sauceId },{$push: { usersDisliked: {$each: [ ], $slice: indDisliked}}, $inc: { dislikes: -1 }})
    .then(() => res.status(200).json({ message: ' ' }))
    .catch((error) => res.status(400).json({ error }))
  }
  
}
 

  })
}
  
