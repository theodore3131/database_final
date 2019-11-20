const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true}
});

// need to turn the definition into a model
module.exports = mongoose.model('Post', postSchema);
