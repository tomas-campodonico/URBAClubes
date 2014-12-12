'use strict';

$(document).ready(function() {

	//Read JSON and create list
	$.getJSON('/clubes.json', function(clubes) {
	  $.each(clubes, function(key, club) {
	  	$('.clubList').append('<li data-name="' + club.name +
	  		'" data-lat="' + club.lat +
	  		'" data-lon="' + club.lon + '">' + club.shortName + '</li>');
	  });
	  $('.clubList li').on('click', rippleEffect);
	});

	//Show or hide the menu container
	function toggleMenu() {
		$('aside').toggleClass('opened');
		$('.searchBox input').val('');
	}

	//Show ripple effect
	function rippleEffect(ev) {
		var ink, d, x, y;

		//create .ink element if it doesn't exist
		if($(this).find('.ink').length === 0) {
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

	$('.toggleMenuButton').on('click', toggleMenu);
	$('.backshadow').on('click', toggleMenu);
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
	
});