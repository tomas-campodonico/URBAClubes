define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var ProjectModel = Backbone.Model.extend({
    
    defaults: {
      address: ""
    }

  });

  return ProjectModel;
});