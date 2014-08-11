define([
	'underscore',
	'backbone',
	'models/club'
], function(_, Backbone, ClubModel) {

	var ClubCollection = Backbone.Collection.extend({
		model: ClubModel,
		url: '../json/clubes.json',

		/*
		* Returns whether there is a club with the given name
		* returns boolean
		*/
		getByShortName: function(clubName) {
			return _.find(this.models, function(club) {
				return club.get('short_name') === clubName;
			});
		}
	});

	return ClubCollection;
});