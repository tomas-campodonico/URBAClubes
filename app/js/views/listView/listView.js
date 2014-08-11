define([
  'jquery',
  'underscore',
  'backbone',
  'text!./index.html',
  'collections/clubCollection'
], function($, _, Backbone, template, ClubCollection) {

  var ProjectListView = Backbone.View.extend({
    el: $('#container'),

    events: {
      'keyup #search-input': 'filterList'
    },

    initialize: function() {
      this.clubes = new ClubCollection();
      this.dataReady = this.clubes.fetch();
    },

    render: function(){
      var self = this;

      this.dataReady.then(function() {
        self.$el.html(_.template(template, {
          clubes: self.clubes.models
        }));
      });
    },

    filterList: function() {
      var items = $('li'),
        filterText = $('#search-input').val().toLowerCase(),
        name,
        jItem;

      _.forEach(items, function(item) {
        jItem = $(item);
        name = jItem.find('.club-name').html().toLowerCase();
        if (name.indexOf(filterText) === -1) {
          if (!jItem.hasClass('hidden')) {
            jItem.addClass('hidden');
          }
        } else {
          if (jItem.hasClass('hidden')) {
            jItem.removeClass('hidden');
          }
        }
      });
    }
  });

  return ProjectListView;

});