const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Car name is a must!"], 
    trim: true 
  },
  model: { 
    type: String, 
    required: [true, "Manufacturing year/model is required"] 
  },
  price: { 
    type: Number, 
    required: [true, "Price is necessary"],
    min: [0, "Price cannot be negative"] 
  },
  image: { 
    type: String, 
    default: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800"
  },

  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // 'User' aapke user model ka naam hona chahiye
    required: true 
  }
}, { timestamps: true }); //to show the adding time of cars

module.exports = mongoose.model('Car', carSchema);