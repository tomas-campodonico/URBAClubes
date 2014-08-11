define([
  'jquery',
  'underscore',
  'backbone',
  'views/listView/listView',
  'views/indexView/indexView',
  'views/mapView/mapView'
], function($, _, Backbone, ListView, IndexView, MapView) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      'map': 'showMap',
      'map?club=:a&lat=:b&lon=:c': 'showClubInMap',
      'list': 'showList',
      '': 'showIndex',
      '*actions': 'redirectIndex'
    },

    showMap: function() {
      var mapView = new MapView();
      mapView.render();
    },

    showClubInMap: function(a, b, c) {
      var mapView = new MapView({
        lat: b,
        lon: c,
        clubName: a
      });
      mapView.render();
    },

    showList: function() {
      var listView = new ListView();
      listView.render();
    },

    showIndex: function() {
      var indexView = new IndexView();
      indexView.render();
    },

    redirectIndex: function(actions) {
      this.navigate('', true);
    }
  });

  var initialize = function() {
    var app_router = new AppRouter;

    Backbone.history.start();
  };

  return {
    initialize: initialize
  };

});