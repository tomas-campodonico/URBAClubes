require.config({
	paths: {
		'jquery': 'vendor/jquery/jquery',
		'underscore': 'vendor/underscore-amd/underscore',
		'backbone': 'vendor/backbone-amd/backbone',
		'text': 'vendor/requirejs-text/text',
        'jquery-mobile': 'vendor/jquery-mobile/jquery.mobile.custom.min',
		'googlemap': 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCyIONBoivZKIXXpSS06KneRlRfwFSZheY&sensor=false&callback=initGoogleMap'
	}
});

require(['app'], function(App) {
	App.initialize();
});

/* 
 * Used to load google maps
 */
window.loadr = {
    _plugins: {},
    _queue: {},

    ready: function (plugin, cb, scope) {
        'use strict';
        if (this._plugins[plugin]) {
            cb.apply(scope || null);
        } else {
            var q = this._queue[plugin];
            if (!q) {
                q = this._queue[plugin] = [];
            }
            q.push({fn: cb, scope: scope || null});
        }
    },

    fire: function (plugin) {
        'use strict';
        var q = this._queue[plugin],
            i;
        console.log('Loaded Plugin: <<' + plugin + '>>');
        this._plugins[plugin] = true;

        if (q) {
            for (i in q) {
                if (q.hasOwnProperty(i)) {
                    q[i].fn.apply(q[i].scope);
                }
            }
        }
        this._queue[plugin] = [];
    }
};

window.initGoogleMap = function () {
    'use strict';
    window.loadr.fire('GoogleMap');
};