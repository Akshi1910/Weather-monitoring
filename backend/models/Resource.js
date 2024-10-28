const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the resource (e.g., Water, Food)
  type: { 
    type: String, 
    required: true, 
    enum: ['Offer', 'Request'] // Options for resource type
  },
  quantity: { type: Number, required: true }, // Quantity or units of the resource
  location: { type: String, required: true }, // Where the resource is located (linked to the reported disaster)
  contactInfo: { type: String, required: true }, // Contact number or email
  description: { type: String, required: true }, // Description of the resource
  disasterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Disaster', // Reference to the Disaster model
    required: true 
  },
  fulfilled: { type: Boolean, default: false }, // Status of the request/offer (default is not fulfilled)
  date: { type: Date, default: Date.now }, // Timestamp of the resource report
});

module.exports = mongoose.model('Resource', resourceSchema);
