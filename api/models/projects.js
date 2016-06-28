var mongoose = require('mongoose');

var pageItemSchema = new mongoose.Schema({
  position: {
    type: Number,
    "default": 0
  },
  type:{
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false // Not needed for page break.
  },
  contentArray: {
    type: [String], // Used for gallery list of images
    required: false // Only used for gallery.
  }
});

// IMMEDIATE TODO: This is better than I originally thought. Will have to change some of the mappings
// in the api layer to match this. Actually makes things easier.
var projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position:{
      type: Number,
      "default": 0,
    },
    category: {
      type: String,
      required: true
    },
    projectCoverImage: {
      type: String,
      required: true
    },
    projectCoverImageAspectRatio: {
      type: Number,
      required: true
    },
    pageItems: [pageItemSchema]
});

mongoose.model('Project', projectSchema);
