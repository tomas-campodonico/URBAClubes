"use strict";$(document).ready(function(){function a(){$(".instructionsModal").hasClass("opened")?($(".instructionsModal").removeClass("opened"),$(".instructionsModal").addClass("hidden")):(n.toggle(),$(".searchBox input").val(""),h())}function b(a){var b,c,d,e;0===$(this).find(".ink").length&&$(this).prepend('<span class="ink"></span>'),b=$(this).find(".ink"),b.removeClass("animate"),b.height()||b.width()||(c=Math.max($(this).outerWidth(),$(this).outerHeight()),b.css({height:c,width:c})),d=a.pageX-$(this).offset().left-b.width()/2,e=a.pageY-$(this).offset().top-b.height()/2,b.css({top:e+"px",left:d+"px"}).addClass("animate")}function c(a){var b=$.Deferred();return navigator.geolocation.getCurrentPosition(b.resolve,b.reject,a),b.promise()}function d(a,b){$(".alert").text(a),$(".alert").removeClass("hidden"),"number"!=typeof b&&(b=1e4),setTimeout(function(){e()},b)}function e(){$(".alert").addClass("hidden")}function f(a){k.route(a,function(a,b){b===google.maps.DirectionsStatus.OK?(l.setDirections(a),$(".instructionsButton").removeClass("hidden")):d("Hubo un problema. Compruebe su conexión a internet y vuelva a intentarlo.",15e3)})}function g(a){navigator.geolocation?$.when(i).done(function(b){$(".loadingMask").addClass("hidden"),f({origin:new google.maps.LatLng(b.coords.latitude,b.coords.longitude),destination:new google.maps.LatLng(a.lat,a.lon),travelMode:google.maps.TravelMode.DRIVING})}):d("La aplicación no es soportada por su navegador o el usuario no ha concedido permisos de ubicación.",6e3)}function h(){var a=$(".searchBox input").val().toLowerCase();$(".clubList li").each(function(b,c){-1!==c.dataset.name.toLowerCase().indexOf(a)||-1!==$(c).text().toLowerCase().indexOf(a)?$(c).removeClass("hidden"):$(c).addClass("hidden")})}var i,j={zoom:9,mapTypeId:google.maps.MapTypeId.ROADMAP,center:new google.maps.LatLng(-34.840013,-58.265991)},k=new google.maps.DirectionsService,l=new google.maps.DirectionsRenderer,m=new google.maps.Map($("#map-canvas")[0],j),n=new Slideout({panel:document.getElementById("panel"),menu:document.getElementById("menu"),padding:256,duration:100,tolerance:20});$(".toggleMenuButton").on("click",a),$(".backshadow").on("click",a),$(".instructionsButton").on("click",function(a){b.call(a.currentTarget,a),$(".instructionsModal").removeClass("hidden"),$(".instructionsModal").addClass("opened")}),$(".searchBox input").on("keyup",h),l.setMap(m),l.setPanel($(".instructionsModal .instructions")[0]),navigator.geolocation&&(i=c()),$.getJSON("/URBAClubes/clubes.json",function(c){$.each(c,function(a,b){$(".clubList").append('<li data-name="'+b.name+'" data-lat="'+b.lat+'" data-lon="'+b.lon+'">'+b.shortName+"</li>")}),$(".clubList li").on("click",function(c){b.call(c.currentTarget,c),a(),$(".loadingMask").removeClass("hidden"),g({name:$(c.currentTarget).text(),lat:c.currentTarget.dataset.lat,lon:c.currentTarget.dataset.lon})})})});