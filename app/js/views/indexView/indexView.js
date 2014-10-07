define([
  'jquery',
  'underscore',
  'backbone',
  'text!./index.html'
], function($, _, Backbone, template) {

  var ProjectListView = Backbone.View.extend({
    el: $('#container'),

    render: function(){
      if (!$('div.index-view').length) {
        this.$el.html(_.template(template));
      }
    }
  });

  return ProjectListView;

});