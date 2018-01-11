/**
 * To do:
 * - Search Options
 * 		- Usage rights (http://moz.com/ugc/the-ultimate-guide-to-the-google-search-parameters)
 * - Other Tasks
 * 		- Hotkeys
 *		- Open page with embedded ads
 */

var query_vars = {
	num_results: {
		key: 'num', // -> The number of results you want displayed, it ranges from 0 to 100. If you set num to 0 you will get the ‘No match found” message
		value: ''
	},
	safe: {
		key: 'safe', // -> If you set this to active the Google Safe Search is on and the adult material will be filtered
		value: ''
	},
	exclude: {
		key: 'as_eq', // -> Use this to exclude a term from your search
		value: ''
	},
	age: {
		key: 'as_qdr', // -> Shows only results that have been updated in the given time interval. Possible values: y (year), m6 (6 months), m3 (3 months).
		value: ''
	},
	site: {
		key: 'as_sitesearch', // -> Limits the search to a specific domain or TLD (.us; .gov; .co.uk; .ro; etc)
		value: ''
	},
	keyword_in: {
		key: 'as_occt', // -> This is set by default to ‘any’ but if you change it you can search in: title, url, links
		value: ''
	},
	search_for: {
		key: 'tbm',
		value: ''
	},
	filetype: {
		key: 'as_filetype',
		value: ''
	},
	personalised: {
		key: 'pws',
		value: '0'
	},
	safe: {
		key: 'safe',
		value: 'images'
	}
};

if( typeof( localStorage['asx-local-settings'] ) === 'undefined' ) {
	var local_settings = {
		sort_order: []
	};
} else {
	var local_settings = JSON.parse( localStorage['asx-local-settings'] );
}

$(document).ready(function(){

	// Focus keywords input
	$('#keywords').focus();

	// Show keyboard shortcuts
	$('#show-keyboard-shortcuts').click(function(){
		$('#keyboard-shortcuts').slideToggle();
	});

	// Form Submit Handler
	$('.search-form').on('submit', function(){

		// Keywords
		var keywords = encodeURIComponent( $('#keywords').val() );

		// Query type (AND / OR / EXACT)
		var query_type = $('input[name=type]:checked').val();

		// Basic URL
		var url = 'http://google.com/search?' + query_type + '=' + keywords;

		// Exclude words
		if( $('#exclude').val() !== '' ) {
			query_vars.exclude.value = encodeURIComponent( $('#exclude').val() );
			url += '&' + query_vars.exclude.key + '=' + query_vars.exclude.value;
		}

		// Site / domain
		if( $('#site').val() !== '' ) {
			query_vars.site.value = encodeURIComponent( $('#site').val() );
			url += '&' + query_vars.site.key + '=' + query_vars.site.value;
		}

		// Personalised search
		if( $('#unpersonalise').is(':checked') ) {
			url += '&' + query_vars.personalised.key + '=' + query_vars.personalised.value;
		}

		// Safe search
		if( $('#unsafe').is(':checked') ) {
			url += '&' + query_vars.safe.key + '=' + query_vars.safe.value;
		}

		// File type
		if( $('#filetype').val() !== '' ) {
			var filetype = $('#filetype').val();
			filetype = filetype.replace('.','');
			/* Multiple filetypes, can't figure out how google wants them
			filetypes = filetype.split(',');
			console.log(filetypes);*/
			query_vars.filetype.value = encodeURIComponent( filetype );
			url += '&' + query_vars.filetype.key + '=' + query_vars.filetype.value;
		}

		// Keword in
		if( ! $('[title="keyword_in"][value="any"]').is(':checked') ) {
			query_vars.keyword_in.value = $('input[name=keyword_in]:checked').val();
			url += '&' + query_vars.keyword_in.key + '=' + query_vars.keyword_in.value;
		}

		// Search for (images, news, videos etc)
		if( ! $('[name="search_for"][value="web"]').is(':checked') ) {
			query_vars.search_for.value = $('input[name=search_for]:checked').val();
			url += '&' + query_vars.search_for.key + '=' + query_vars.search_for.value;
		}

		// Age of result
		if( $('#age_number').val() !== '' ) {
			var age_num = $('#age_number').val();
			var age_unit = $('input[name=age_unit]:checked').val();
			query_vars.age.value = age_unit + age_num;
			url += '&' + query_vars.age.key + '=' + query_vars.age.value;
		}

		var newTabProperties = {
			url: url
		};

		chrome.tabs.create(newTabProperties);
	});

	// Make items sortable
	var el = document.getElementById('sortable-items');
	var sortable = Sortable.create(el, {
		animation: 150,
		onUpdate: function(e) {
			var sort_order = [];
			$('#sortable-items [data-id]').each(function(){
				sort_order.push( $(this).data('id') );
			});
			console.log(sort_order);
			local_settings.sort_order = sort_order;
			localStorage['asx-local-settings'] = JSON.stringify(local_settings);
		}
	});

	// Rearrange items if we've previously sorted them
	if( local_settings.sort_order.length ) {
		// Reverse the array so that we can prepend instead of appending
		// this means we can still get the ordering right if new options have been added in a future version
		var reversed_sort_order = local_settings.sort_order.reverse();
		$.each(reversed_sort_order, function(index, value) {
			$('#sortable-items').prepend( $('[data-id="' + value + '"]') );
		});
	}

});


// Google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59779036-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();