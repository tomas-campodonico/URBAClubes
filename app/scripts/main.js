'use strict';

$(document).ready(function() {
	var mapOpts = {
    zoom: 9,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(-34.840013, -58.265991)
  },
  	directionsService = new google.maps.DirectionsService(),
  	directionsDisplay = new google.maps.DirectionsRenderer(),
  	map = new google.maps.Map($('#map-canvas')[0], mapOpts),
  	dfd;

	/* -------------- FUNCTIONS -------------------- */

	//Show or hide the menu container
	function toggleMenu() {
		if ($('.instructionsModal').hasClass('opened')) {
			$('.instructionsModal').removeClass('opened');
			$('.instructionsModal').addClass('hidden');
		} else {
			$('aside').toggleClass('opened');
			$('.searchBox input').val('');
		}
	}

	//Show ripple effect
	function rippleEffect(ev) {
		var ink, d, x, y;

		//create .ink element if it doesn't exist
		if ($(this).find('.ink').length === 0) {
			$(this).prepend('<span class="ink"></span>');
		}
			
		ink = $(this).find('.ink');
		//incase of quick double clicks stop the previous animation
		ink.removeClass('animate');
		
		//set size of .ink
		if(!ink.height() && !ink.width()) {
			//use $(this)'s width or height whichever is larger for the diameter to make a circle which can cover the entire element.
			d = Math.max($(this).outerWidth(), $(this).outerHeight());
			ink.css({height: d, width: d});
		}
	
		x = ev.pageX - $(this).offset().left - ink.width()/2;
		y = ev.pageY - $(this).offset().top - ink.height()/2;
		ink.css({
			top: y + 'px',
			left: x + 'px'
		}).addClass('animate');
	}

	//Get user location
	function getCurrentPositionDeferred(options) {
    var deferred = $.Deferred();
    navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, options);
    return deferred.promise();
  }

  //Show route in map
	function showRouteInMap(request) {
    directionsService.route(request, function(result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        //_showResults(result);
        directionsDisplay.setDirections(result);
        $('.instructionsButton').removeClass('hidden');
      }
    });
  }

	//Calculate route
	function calcRoute(club) {
		if (navigator.geolocation) {
      $.when(dfd).done(function(pos) {
      	console.dir(pos);
        showRouteInMap({
          origin: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          destination: new google.maps.LatLng(club.lat, club.lon),
          travelMode: google.maps.TravelMode.DRIVING
        });
      });
    } else {
    	$('.noGeolocationAlert').removeClass('hidden');
    	setTimeout(function() {
    		$('.noGeolocationAlert').addClass('hidden');
    	}, 6000);
    }
  }

  /* -------------------------- HANDLERS ------------------------------- */
	$('.toggleMenuButton').on('click', toggleMenu);
	$('.backshadow').on('click', toggleMenu);
	$('.instructionsButton').on('click', function(ev) {
		rippleEffect.call(ev.currentTarget, ev);
		$('.instructionsModal').removeClass('hidden');
		$('.instructionsModal').addClass('opened');
	});
	$('.searchBox input').on('keyup', function() {
		var searchText = $('.searchBox input').val().toLowerCase();

		$('.clubList li').each(function(index, item) {
			if (item.dataset.name.toLowerCase().indexOf(searchText) !== -1 || $(item).text().toLowerCase().indexOf(searchText) !== -1) {
				$(item).removeClass('hidden');
			} else {
				$(item).addClass('hidden');
			}
		});
	});


	/* -------------------------- INIT ------------------------------------ */
	//init map  
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel($('.instructionsModal .instructions')[0]);

  if (navigator.geolocation) {
    dfd = getCurrentPositionDeferred();
  }

	//Read JSON and create list
	$.getJSON('/clubes.json', function(clubes) {
	  $.each(clubes, function(key, club) {
	  	$('.clubList').append('<li data-name="' + club.name +
	  		'" data-lat="' + club.lat +
	  		'" data-lon="' + club.lon + '">' + club.shortName + '</li>');
	  });

	  $('.clubList li').on('click', function(ev) {
	  	rippleEffect.call(ev.currentTarget, ev);
	  	toggleMenu();
	  	calcRoute({
	  		name: $(ev.currentTarget).text(),
	  		lat: ev.currentTarget.dataset.lat,
	  		lon: ev.currentTarget.dataset.lon
	  	});
	  });
	});
	
});