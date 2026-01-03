// Clear Mongoose model cache
const mongoose = require('mongoose');

// Delete the cached model
delete mongoose.models.Trip;
delete mongoose.modelSchemas.Trip;

console.log('Mongoose model cache cleared');