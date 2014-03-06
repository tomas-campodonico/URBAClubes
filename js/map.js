(function() {

	var directionsDisplay,
		directionsService = new google.maps.DirectionsService(),
		map,
		clubes = new Array;


	$(document).ready( function() {
		//Initialize map centered in Buenos Aires province
		directionsDisplay = new google.maps.DirectionsRenderer(); 
		map = new google.maps.Map($('#map-canvas').get(0), {
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: new google.maps.LatLng(-34.840013, -58.265991)
		});
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel($('.route-info__instructions').get(0));

		_initializeDropdownsValues();
		$('#get-route').click(calcRoute);
		$('.show-route-options').click(function(ev){
			if (ev.target === ev.currentTarget || $(ev.target).hasClass('arrow')) {
				$('.route-options').toggle();
				$(ev.currentTarget).find('.arrow')
				  .toggleClass('pointerDown')
				  .toggleClass('pointerUp');
				}
		});
	});

	/*
	* @constructor Club
	*/
	Club = function(name, dir, lat, lon, waypoints) {
		this.nombre = name;
		this.direccion = dir;
		this.latitud = lat;
		this.longitud = lon;
		if (waypoints) {
			this.waypoints = [];
			for (var l = 0; l < waypoints.length; l++) {
				this.waypoints.push({
		    	location: new google.maps.LatLng(waypoints[l].lat, waypoints[l].lon),
		    	stopover: true
				});
			}
		}
	};

	/*
	* It calculates the route given the origin and the destination points.
	* @method calcRoute
	*/
	calcRoute = function() {
		var start,
			endClub,
			dfd;

		start = $('#origin-club').val();
	  endClub = $('#select-club').val();

		if (typeof clubes[endClub] !== 'undefined') {
			if (clubes[start]) {
				_sendRequest({
					origin: new google.maps.LatLng(clubes[start].latitud, clubes[start].longitud),
					destination: new google.maps.LatLng(clubes[endClub].latitud, clubes[endClub].longitud),
					travelMode: google.maps.TravelMode.DRIVING,
					waypoints: clubes[endClub].waypoints || [],
					avoidTolls: $('#avoid-tolls-option').prop('checked')
				});
			} else {
				if (navigator.geolocation) {
					dfd = _getCurrentPositionDeferred();
					$.when(dfd).done(function(pos) {
						_sendRequest({
							origin: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
							destination: new google.maps.LatLng(clubes[endClub].latitud, clubes[endClub].longitud),
							travelMode: google.maps.TravelMode.DRIVING,
							waypoints: clubes[endClub].waypoints || [],
							avoidTolls: $('#avoid-tolls-option').prop('checked')
						});
					});
				} else {
			    alert('Al parecer la funcionalidad de Geolocalizacion, necesaria por la aplicacion, no está disponible en su navegador.');
			  }
			}
		}

		$(window).scrollTop($('#map-canvas').offset().top);
		return false;
	};

	/*
	* Initializes the clubs array.
	* @method _initializeClubs
	* @private
	*/
	_initializeClubs = function(){
		var club,
			option;

		clubes = {};
		clubes['Albatros'] = new Club('Albatros Rugby Club', 'Calle 135 y 515 - La Plata', -34.91339, -58.016999);
		clubes['Areco'] = new Club('Areco Rugby Club', 'Ruta Nacional Nº 8 Km. 110,5 y Provincial Nº 41 de San Antonio de Areco (CP 2760). Pcia. de Buenos Aires', -34.259145, -59.451434);
		clubes['CAR'] = new Club('Club Argentino de Rugby', 'Altura Kilómetro 43 ½ de la Ruta Nacional Nº2', -34.922797, -58.165532);
		clubes['Lanus'] = new Club('Asociacion Lanus Rugby Club', 'Gral. Ferré y Almeyda, Lanús Este - Pcia. de Buenos Aires', -34.718407, -58.388347);
		clubes['Alumni'] = new Club('Asociacion Alumni', 'Directorio 1155, Tortuguitas', -34.458959,-58.735469);
		clubes['AP Brandsen'] = new Club('Atletico y Progreso C.S.D y C.', 'Calle nº 25 entre Alberti y Saenz Peña', -35.181797, -58.228711);
		clubes['Banco Nacion'] = new Club('Club Atletico Banco de la Nacion Argentina', 'Fray Luis Beltrán, entre Guayaquil e Hiroshima, Ing. Pablo Nogués', -34.47447, -58.714958);
		clubes['Banco Hipotecario'] = new Club('Club Banco Hipotecario Nacional', 'Av. Franklin Roosevelt y Caferatta - Villa Celina (1772)', -34.697722, -58.477121);
		clubes['Belgrano Ath'] = new Club('Belgrano Athletic Club', 'Virrey del Pino 3456 - Capital Federal', -34.572335, -58.464247);
		clubes['Belgrano Anexo'] = new Club('Belgrano Athletic Club Anexo', 'Campo de Pinazo: Ruta Panamericana Kilometro 46 - Ramal Pilar', -34.432589, -58.825546);
		clubes['Beromama'] = new Club('Beromama Club', 'Dr. Equiza (Ex Cuyo) 7010 - Barrio Los Ceibos, González Catán', -34.792598, -58.619144);
		clubes['BACRC'] = new Club('Buenos Aires Cricket & Rugby Club', 'Avda Uruguay 7000 - San Fernando', -34.485218, -58.592224);
		clubes['Centro Naval'] = new Club('Centro Naval', 'Av. Cantilo y Arroyo Medrano - Capital Federal', -34.537459, -58.458298);
		clubes['Champagnat'] = new Club('Club Champagnat', 'Sede José Baca Castex - Panamericana Km 56.5 (dentro del Emprendimiento Estancias del Pilar)', -34.493881, -58.980518);
		clubes['Ciudad Bs As'] = new Club('Club Ciudad de Buenos Aires', 'Av. Libertador y Crisólogo Larralde - Capital Federal', -34.544485, -58.459778);
		clubes['Ciudad de Campana'] = new Club('Ciudad de Campana', 'Chiclana 209 - Campana', -34.158027, -58.966882);
		clubes['CASI'] = new Club('Club Atletico San Isidro', 'Roque Sáenz Peña 499, Acassuso', -34.474324, -58.506095);
		clubes['CASI Escobar'] = new Club('CASI Escobar', '', -34.361478, -58.811571);
		clubes['Curupayti'] = new Club('Curupayti', 'Acassuso 2450, Hurlingham', -34.590143, -58.647034);
		clubes['DAOM'] = new Club('Club DAOM', 'Varela 1802, esquina Castañares - Capital Federal', -34.647216, -58.449127);
		clubes['DAOM Anexo'] = new Club('DAOM Anexo', 'Ana María Janner y Av. Lafuente - Capital Federal', -34.657038, -58.446633);
		clubes['Dep. Francesa'] = new Club('Asociacion Deportiva Francesa', 'Ruta Panamericana, Acceso a Pilar Km. 42,5 Del Viso', -34.437265, -58.791712);
		clubes['Don Bosco'] = new Club('Ateneo Cultural y Deportivo Don Bosco', 'Ruta Provincial 53, Km. 13,500 - Florencia Varela', -34.919296, -58.267327);
		clubes['El Retiro'] = new Club('El Retiro Rugby', 'Solis Garay y Camino del Buen Ayre, vías ferrocarril Gral. San Martín - Hurlingham', -34.575123, -58.660702);
		clubes['GEBA'] = new Club('Club de Gimnasia y Esgrima Bs. As.', 'Sección (San Martín): Av. Figueroa Alcorta 5575 - Capital Federal', -34.560876, -58.422584);
		clubes['GEBA Anexo'] = new Club('GEBA Anexo', 'Sección (Jorge Newbery): Av. Coronel M. A. Freire y Av. Dorrego - Capital Federal', -34.569031, -58.420781);
		clubes['GEI'] = new Club('Club Gimnasia y Esgrima de Ituzaingo', 'Grecia 2640 entre Almagro y Portugal - Ituzaingó', -34.652022, -58.698103);
		clubes['Hindu'] = new Club('Hindu Club', 'Ruta 202 y Av. Del Golf - Don Torcuato', -34.497471, -58.642581);
		clubes['Hurling'] = new Club('Hurling Club', 'Coronel José de San Martín 5415 ex Avda. Vergara- Hurlingham', -34.574393, -58.644027);
		clubes['Italiano'] = new Club('Club Italiano', 'Av. Riestra 2770 - Capital Federal', -34.653014, -58.446971);
		clubes['La Plata'] = new Club('La Plata Rugby Club', 'Camino Centenario - Gonnet', -34.878675, -58.018606);
		clubes['La Salle'] = new Club('Club Asosiacion de ex-alumnos del colegio de La Salle', 'Suipacha y La Crujía -Partido de San Martín', -34.577953, -58.556748);
		clubes['Las Cañas'] = new Club('Las Cañas Rugby Club', 'Carlos Pellegrini y Santa Cruz - Cañuelas', -35.059105, -58.741981);
		clubes['Liceo Militar'] = new Club('Liceo Militar Gral. San Martin', 'Av. J.M.de Rosas-Ex-Marquez 6156(Camino de Cintura) y Triunvirato, Loma Hermosa, San Martín', -34.567882, -58.589761);
		clubes['Liceo Naval'] = new Club('Liceo Naval', 'Av. Cantilo y Udaondo s/n. - Capital Federal.', -34.540283, -58.451758);
		clubes['Lomas'] = new Club('Club Atletico Lomas', 'Arenales 663 - Lomas de Zamora', -34.75417, -58.388861);
		clubes['Lomas Anexo'] = new Club('Club Atletico Lomas Anexo', 'Canalejas y Torquinst - Longchamps', -34.857856, -58.373647);
		clubes['Los Cedros'] = new Club('Club Los Cedros', 'Ruta 202 y El Centinela - San Miguel', -34.528225, -58.686149);
		clubes['Los Matreros'] = new Club('Los Matreros Rugby Club', 'Sarmiento 1371 - Morón', -34.647994, -58.627025);
		clubes['Anexo Los Matreras'] = new Club('Anexo de Los Matreros Rugby Club', 'Gral. Pintos y Ricardo Gutiérrez - Villa Malaver', -34.599348, -58.766776);
		clubes['Los Pinos'] = new Club('Club Los Pinos', 'Joaquín V. González (Ex. J. B. Justo) Nº 250 - La Lonja - Partido de Pilar', -34.449136, -58.824591);
		clubes['Los Tilos'] = new Club('Los Tilos Club de Rugby', 'Calle 21 y 522 - La Plata', -34.905272, -57.994664);
		clubes['Lujan'] = new Club('Lujan Rugby Club', 'Dr. Real entre Francia y Rivadavia - Luján', -34.56018, -59.116388);
		clubes['Manuel Belgrano'] = new Club('Club Manuel Belgrano', 'Benito Lynch. S/Nº - Carupa - Partido de Tigre', -34.437323, -58.591684);
		clubes['Manuel Belgrano Anexo'] = new Club('Club Manuel Belgrano Anexo', 'Crisólogo Larralde 5255 - Capital Federal', -34.562642, -58.494903);
		clubes['Manuel Belgrano - Sede Maschwitz'] = new Club('Club Manuel Belgrano Maschwitz', 'La Pista 1601, esq. Lago Puelo - Maschwitz', -34.363699, -58.736561);
		clubes['Mariano Moreno'] = new Club('Club y Biblioteca Mariano Moreno', 'Padre Fahy y San Luis - Moreno', -34.663734, -58.825578);
		clubes['Monte Grande'] = new Club('Monte Grande Rugby Club', 'P. Dreyer 3302 - Monte Grande', -34.848688, -58.493223);
		clubes['Vicente Lopez'] = new Club('Club Municipalidad de la Ciudad de Vicente Lopez', 'Bme. Cruz 1175 -Vicente López', -34.523332, -58.47136);
		clubes['Nautico Arsenal Zarate'] = new Club('Nautico Arsenal Zarate Club', 'Av. Rivadavia (esquina Crucero Gral. Belgrano 106) - Zarate', -34.092279, -59.018807);
		clubes['Newman'] = new Club('Club Newman', 'Avda. de los Constituyentes 7245 Ruta 9 Km. 39,5, Benavidez', -34.411078, -58.71296);
		clubes['Newman Anexo'] = new Club('Club Newman Anexo', 'Carlos Gardel entre Reclus y Blanco Encalada, Boulogne', -34.488226, -58.56167);
		clubes['Obras'] = new Club('Club Atletico Obras Sanitarias de la Nacion', 'Ruta 21 y Cristianía, Laferrere, Pdo. de La Matanza', -34.733557, -58.553106);
		clubes['Olivos'] = new Club('Rugby Club Olivos', 'Mariano Pelliza 4550. Munro', -34.521271, -58.520696);
		clubes['Porteño'] = new Club('Club Atletico Porteño', 'Magallanes y Pardo - San Vicente', -35.01333, -58.445039);
		clubes['Pucara'] = new Club('Club Pucara', 'Falucho 766. Burzaco', -34.815987, -58.386028);
		clubes['Pueyrredon'] = new Club('Pueyrredon Club de Rugby', 'Cap. Juan de San Martín Nº 1391. Boulogne - San Isidro', -34.493449, -58.572715);
		clubes['Pueyrredon Anexo'] = new Club('Anexo de Pueyrredon Club de Rugby', 'Ruta Panamericana (Ramal a Garín) km. 38 - Benavidez', -34.394725, -58.66265);
		//clubes['Regatas BV'] = new Club('Club de Regatas Bella Vista', '', );
		//clubes['Atletico del Rosario'] = new Club('Club Atletico del Rosario', '', );
		//clubes['San Albano'] = new Club('Asociacion de ex-alumnos del Colegio San Albano', '', );
		//clubes['San Andres'] = new Club('Asociacion de ex-alumnos San Andres', '', );
		//clubes['San Antonio de Padua'] = new Club('Club Atletico San Antonio de Padua', '', );
		//clubes['San Carlos'] = new Club('Club San Carlos', '', );
		//clubes['San Cirano'] = new Club('Club San Cirano', '', );
		//clubes['San Fernando'] = new Club('Club San Fernando', '', );
		clubes['SIC'] = new Club('San Isidro Club', 'Av. Blanco Encalada 404 - San Isidro', -34.492407, -58.556835);
		clubes['SIC Anexo'] = new Club('San Isidro Club Anexo', 'Camino Real - Morón - San Fernando 1998 - Boulogne Sur', -34.486846, -58.561308);
		//clubes['San Jose'] = new Club('Club San Jose', '', );
		clubes['San Luis'] = new Club('Club San Luis', 'Calle 520 e/ 27 y 29 - La Plata', -34.910240, -58.003950);
		//clubes[''] = new Club('', '', );
		//clubes[''] = new Club('', '', );

		for (club in clubes){
			option = $('<option/>');
			option.attr({ 'value': club }).text(club);
			$('#select-club').append(option);
			option.clone().appendTo($('#origin-club'));
		}
	};

	/*
	* Initializes dropdowns with all the clubs
	*/
	_initializeDropdownsValues = function() {
		var option = $('<option>Desde donde estoy...</option>');
		$('#origin-club').append(option);

		_initializeClubs();
	};

	/*
	* Sends the request of the route and display the results
	* @method _sendRequest
	*/
	_sendRequest = function(request) {
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				_showResults(result);
				directionsDisplay.setDirections(result);
			}
		});
	};

	/*
	*	Get user's current position. It returns a promise
	* @method _getCurrentPositionDeferred
	* @private
	*/
	_getCurrentPositionDeferred = function(options) {
	  var deferred = $.Deferred();
	  navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, options);
	  return deferred.promise();
	};

	/*
	* Hide or show DOM elements with the result of the route
	* @method _showResults
	* @private
	*/
	_showResults = function(result) {
		if(result.routes[0].legs[0].distance.text || result.routes[0].legs[0].duration.text) {
			$('.route-info').css('visibility', 'visible');
			$('.route-info__distance').html(result.routes[0].legs[0].distance.text);
			$('.route-info__duration').html(result.routes[0].legs[0].duration.text);
		} else {
			$('.route-info').css('visibility', 'hidden');
			$('.route-info__distance').html('');
			$('.route-info__duration').html('');
		}
	};	

	return {
		calcRoute: calcRoute
	};

})();