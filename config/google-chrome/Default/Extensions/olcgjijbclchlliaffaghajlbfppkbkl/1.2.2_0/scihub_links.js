function scihub_links() {
	chrome.storage.local.get({
    'Cserver' : 'sci-hub.tw'
	}, function(items) {
		$('body *').replaceText( /(?:http[s]?:\/\/[dx\.]?doi\.org\/)(10\.[0-9]{4,5}\/[^\s]+[^\.\s\)]+)/gi, '<a href="http://' + items.Cserver + '/$1" target="_blank">http://' + items.Cserver + '/$1</a>' ); // DOI
		$('body *').replaceText( /((?:10\.(?:[0-9]{4,5})\/[^\s]+[^\.\s\)]+))/gi, '<a href="http://' + items.Cserver + '/$1" target="_blank">$1</a>' ); // DOI
		$('body *').replaceText( /(PMID\:[\s]?([0-9]{8}))/gi, '<a href="http://www.ncbi.nlm.nih.gov.' + items.Cserver + '/pubmed/$2" target="_blank">$1</a>' ); // PMID
		if (window.location.href.indexOf("www.ncbi.nlm.nih.gov") >= 0) {
			$('body *').replaceText( /(?:([0-9]{8}))/gi, '<a href="http://www.ncbi.nlm.nih.gov.' + items.Cserver + '/pubmed/$1" target="_blank">$1</a>' ); // PMID
		}
		$("a[href*='dx.doi.org']").each(function() {
			var $this = $(this);
			var href = $this.attr('href');
			if ($this.attr('href').indexOf (items.Cserver) < 0 ) {
				href = $this.attr('href').replace( /dx\.doi\.org/, items.Cserver );
			}
			if ( href.indexOf ('http') < 0 )
			{
				href = ("http://" + href).replace("////", "//");
			}
			else if ( href.indexOf ('https') >= 0 )
			{
				href = href.replace("https", "http");
			}
			$this.attr( 'href', href );
			if ($this.text().indexOf('dx.doi.org') >= 0 ) {
				$this.text(href);
				chrome.runtime.sendMessage({greeting: "complete"}, function(response) {
				});
			};
			$this.attr('target', '_blank').removeAttr('onclick');
		});
		if (window.location.href.indexOf("www.ncbi.nlm.nih.gov") >= 0 && (/[0-9]{8}/.test(window.location.href))) {
			$("a[href*='/pubmed']").each(function() {
				var $this = $(this);
				if (/[0-9]{8}/.test($this.attr('href'))) {
					var href = "http://www.ncbi.nlm.nih.gov." + items.Cserver + "/pubmed/" + $this.attr('href').match(/[0-9]{8}/);
					$this.attr( 'href', href );
					$this.attr('target', '_blank').removeAttr('onclick');
				}
			});
		}
	});
}

function origin_links(){
	chrome.storage.local.get({
    'Cserver' : 'sci-hub.tw'
	}, function(items) {
		$("a[href*='sci-hub']").each(function() {
			var $this = $(this);
			var href = $this.attr('href');
			if ($this.attr('href').indexOf('pubmed') >= 0)
			{
				href = $this.attr('href').replace( "." + items.Cserver, '' );
			}
			else
			{
				href = $this.attr('href').replace( items.Cserver, 'dx.doi.org' );
			}
			if ($this.text().indexOf(items.Cserver) >= 0 ){
				$this.text(href);
			}
			$this.attr( 'href', href );
		});
	});
}
scihub_links();

$(window).on('hashchange', scihub_links);

var keyPressed = false;

$(document).on('keydown', function(e) {
	if (keyPressed === false && e.keyCode === 17) {
		keyPressed = true;
		origin_links();
		//console.log('Key start held down');
	}
	$(this).on('keyup', function(e) {
		if (keyPressed === true && e.keyCode === 17) {
			keyPressed = false;
			scihub_links();
			//console.log('Key no longer held down');
		}
	});
});