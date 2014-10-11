define([
  'jquery',
  'underscore',
  'backbone',
  'text!./index.html',
  'collections/clubCollection',
  'helpers/mobileDetection',
  'googlemap',
  'jquery-mobile'
], function($, _, Backbone, template, ClubCollection, mobileDetection, Googlemap) {

  var ProjectListView = Backbone.View.extend({
    el: $('#container'),

    events: {
      'click #get-route': 'calcRoute',
      'click #view-route': 'showRouteInfo',
      'click #close-modal': 'hideRouteInfo',
      'click #info-btn': 'toggleAlert'
    },

    initialize: function(options) {
      if (options) {
        this.options = options;
      }

      this.clubes = new ClubCollection();
      this.dataReady = this.clubes.fetch();

      if (mobileDetection.isMobile()) {
        this.events['swiperight .form-view'] = 'hideForm';
        this.events['click #search-btn'] = 'showForm';
      }
    },

    render: function() {
      var self = this;

      this.dataReady.then(function() {
        self.$el.html(_.template(template, {
          clubes: self.clubes.models
        }));

        if (self.options && self.options.lat && self.options.lon) {
          self.mapOpts = {
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(self.options.lat, self.options.lon)
          };

          //load map
          window.loadr.ready('GoogleMap', self._initMap, self);

          //add marker
          new google.maps.Marker({
            position: new google.maps.LatLng(self.options.lat, self.options.lon),
            map: self.map,
            animation: google.maps.Animation.DROP,
            title: self.options.clubName
          });

          $('#select-club').val(self.options.clubName);

        } else {
          self.mapOpts = {
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(-34.840013, -58.265991)
          };

          //load map
          window.loadr.ready('GoogleMap', self._initMap, self);
        }

        if (mobileDetection.isMobile()) {
          $('.swipe-instructions').removeClass('hidden');
        }
      });
    },

    hideForm: function(ev) {
      $(ev.currentTarget).addClass('left');
      $('#search-btn').removeClass('hidden');
    },

    showForm: function(ev) {
      $(ev.currentTarget).addClass('hidden');
      $('.form-view').removeClass('left');
    },

    showRouteInfo: function(ev) {
      $('.route-info').removeClass('hidden');
    },

    hideRouteInfo: function(ev) {
      $('.route-info').addClass('hidden');
    },

    toggleAlert: function(ev) {
      $('.alert').toggleClass('hidden');
    },

    /*
    * It calculates the route given the origin and the destination points.
    * @method calcRoute
    */
    calcRoute: function() {
      var start,
        dfd,
        clubA, clubB,
        self = this;

      start = $('#origin-club').val();

      clubA = this.clubes.getByShortName(start);
      clubB = this.clubes.getByShortName($('#select-club').val());

      if (clubB) {
        if (clubA) {
          this._sendRequest({
            origin: new google.maps.LatLng(clubA.get('lat'), clubA.get('lon')),
            destination: new google.maps.LatLng(clubB.get('lat'), clubB.get('lon')),
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: clubB.waypoints || []
          });
        } else {
          if (navigator.geolocation) {
            dfd = this._getCurrentPositionDeferred();
            this._showLoadingMask('Buscando posicion...');
            $.when(dfd).done(function(pos) {
              self._sendRequest({
                origin: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                destination: new google.maps.LatLng(clubB.get('lat'), clubB.get('lon')),
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: clubB.waypoints || []
              });
            });
            $.when(dfd).fail(function(error) {
              var message;
              self._hideLoadingMask();
              switch(error.code) {
                case error.PERMISSION_DENIED:
                  message = 'El usuario ha deshabilitado la Geolocalizacion en el browser.'
                  break;
                case error.POSITION_UNAVAILABLE:
                  message = 'No se pudo encontrar su posición. Vuelva a intentarlo.'
                  break;
                case error.TIMEOUT:
                  message = 'No se pudo encontrar su posición. Vuelva a intentarlo.'
                  break;
                case error.UNKNOWN_ERROR:
                  message = 'Ups, algo salió mal. Compruebe su conexión y vuelve a intentarlo.'
                  break;
              }
              alert(message);
            });
          } else {
              alert('La funcionalidad de Geolocalizacion, necesaria para obtener su ubicación, no está disponible en su navegador.');
            }
        }
      }
    },

    /*
    * Sends the request of the route and display the results
    * @method _sendRequest
    * @private
    */
    _sendRequest: function(request) {
      var self = this;
      this._showLoadingMask('Cargando ruta...');
      this.directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          self._showResults(result);
          self.directionsDisplay.setDirections(result);
          self._hideLoadingMask();
          $('#view-route').removeClass('hidden');
        }
      });
    },

    /*
    * Show modal with a loading spinner
    * @private
    */
    _showLoadingMask: function(text) {
      $('.loading-mask span').text(text);
      if ($('.loading-mask').hasClass('hidden')) {
        $('.loading-mask').removeClass('hidden');
      }
    },

    /*
    * Hide or show DOM elements with the result of the route
    * @method _showResults
    * @private
    */
    _showResults: function(result) {
      if (result.routes[0].legs[0].distance.text || result.routes[0].legs[0].duration.text) {
        $('.route-info').css('visibility', 'visible');
        $('.route-info__distance').html(result.routes[0].legs[0].distance.text);
        $('.route-info__duration').html(result.routes[0].legs[0].duration.text);
      } else {
        $('.route-info').css('visibility', 'hidden');
        $('.route-info__distance').html('');
        $('.route-info__duration').html('');
      }
    },

    /*
    * Hide modal with a loading spinner
    * @private
    */
    _hideLoadingMask: function() {
      $('.loading-mask').addClass('hidden');
    },

    /*
    * Get user's current position. It returns a promise
    * @method _getCurrentPositionDeferred
    * @private
    */
    _getCurrentPositionDeferred: function(options) {
      var deferred = $.Deferred();
      navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, options);
      return deferred.promise();
    },

    /*
    * Initialize the map, centered in Buenos Aires
    * @method _initMap
    * @private
    */
    _initMap: function() {
      var trafficLayer = new google.maps.TrafficLayer();
      this.directionsService = new google.maps.DirectionsService(),
      this.directionsDisplay = new google.maps.DirectionsRenderer(); 
      this.map = new google.maps.Map($('#map-canvas').get(0), this.mapOpts);
      trafficLayer.setMap(this.map);
      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setPanel($('.route-info__instructions').get(0));
    }
  });

  return ProjectListView;

});