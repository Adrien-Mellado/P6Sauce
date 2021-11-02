const Sauce = require("../models/Sauce");
const fs = require ('fs');

// Ajout d'une sauce //
exports.CreationSauce = (req, res, next) => {
  // creation une conste sauceObjet ou on lui stocke le req.body.sauce //
  const sauceObjet = JSON.parse(req.body.sauce);

  // supresion de l'id envoyer par le frontend pour pouvoir utiliser uniquement ce lui de la basse de donnée //
  delete sauceObjet._id;

  const sauce = new Sauce({
    ...sauceObjet,
    // recupere l'image donnee dans le req body et l'enregistre dans un dossier images static //
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // sauvegarde de la nouvelle sauce //
  sauce
    .save()
    .then(() => res.status(200).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// modification d'une sauce //
exports.ModificationSauce = (req, res, next) => {
  const sauceObjet = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// supression d'une sauce //
exports.SupressionSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
              .catch(error => res.status(400).json({ error }));
      });
  })
  
  .catch(error => res.status(500).json({ error }));
}

// recuperation d'une seule sauce //
exports.Recuperation_une_Sauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((Sauce) => res.status(200).json(Sauce))
    .catch((error) => res.status(404).json({ error }));
};

// recuperation de toutes les sauces //
exports.Recuperation_Toutes_Sauce = (req, res, next) => {
  Sauce.find()
    .then((Sauce) => res.status(200).json(Sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.likes_Dislike = (req, res, next) => {
  let Like = parseInt(req.body.like);
  let userId = req.body.userId;
  let sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId }).then((sauce) => {
    // metre a jour les données likes //
    if (Like === 1) {
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: "A liké" }))
        .catch((error) => res.status(400).json({ error }));
    }

    // metre a jour les données dislikes //

    if (Like === -1) {
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      )
        .then(() => res.status(200).json({ message: "A disliké" }))
        .catch((error) => res.status(400).json({ error }));
    }

    // comparaison userid et l'userdislikes/likes pour retire le like et metre a jour les données //
    if (Like === 0) {
      const ind = sauce.usersLiked.indexOf(userId);
      if (ind > -1) {
        sauce.usersLiked.slice(ind, 1);
        Sauce.updateOne(
          { _id: sauceId },
          {
            $push: { usersLiked: { $each: [], $slice: ind } },
            $inc: { likes: -1 },
          }
        )
          .then(() => res.status(200).json({ message: "A retiré son like" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (ind === -1) {
        const indDisliked = sauce.usersDisliked.indexOf(userId);
        sauce.usersDisliked.slice(indDisliked, 1);
        Sauce.updateOne(
          { _id: sauceId },
          {
            $push: { usersDisliked: { $each: [], $slice: indDisliked } },
            $inc: { dislikes: -1 },
          }
        )
          .then(() =>
            res.status(200).json({ message: "A retiré son  dislike" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    }
  });
};
