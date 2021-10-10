const mongoose = require("mongoose");

const SauceSchema = mongoose.Schema({
  userId: { 
    type: String, 
    required: false 
  },
  name: { 
    type: String, 
    required: false 
  },
  manufacturer: { 
    type: String, 
    required: false 
  },
  description: { 
    type: String, 
    required: false 
  },
  mainPepper: { 
    type: String, 
    required: false 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  heat: { 
    type: Number, 
    required: false 
  },
  likes: { 
    type: Number, 
    required: false, 
    default: "0" 
  },
  dislikes: { 
    type: Number, 
    required: false, 
    default: "0" 
  },
  usersLiked: { 
    type: [String], 
    required: false 
  },
  usersDisliked: { 
    type: [String], 
    required: false 
  },
});

module.exports = mongoose.model("Sauce", SauceSchema);
