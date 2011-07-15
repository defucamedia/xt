function fixUrls(jqueryObj) {
	jqueryObj.each(function() {
		if (this.href)
			this.href = this.href.replace(/^http:\/\/(.+?)\/(.+)$/, 'http://$1#/$2');
	});
}

var siteOptions = {
		$jPlayer: false,
		continousAudio: false
	};

$(function(){
	$('#continous').live('click', function() {
		siteOptions.continousAudio = this.checked;
	});

	var cache = {
		'': { data: $(''), className: false, title: false },
		'/index.html': { data: $(''), className: 'orange', title: 'Xiaotunes' }
	};
	var loaders = $('topBlock .loading, bottomBlock .loading');
	
	fixUrls($('#nav a, #header a'));

	$(window).bind('hashchange', function(e) {
		siteOptions.$jPlayer && !siteOptions.continousAudio && siteOptions.$jPlayer.jPlayer('stop');

		var url = e.fragment;
		var top = $('#top');
		var urlName = url ? url.replace(/\d/g, '') : window.location.pathname;

		$('#nav a.current').removeClass('current');
		(!window.location.pathname || url) && top.children(':visible').hide();
		urlName && $('#nav a[href$="#' + urlName + '"]').addClass('current');

		if (cache[url]) {
			cache[url].data.fadeIn();
			cache[url].className && top.attr('class', cache[url].className);

			if (cache[url].title)
				document.title = cache[url].title;
		}
		else if (url) {
			loaders.show();
			cache[url] = {data: null, className:'', title: ''};
			cache[url].data = $('<div class="contentItem" />').hide();

			$.ajax({
				url: url,
				type: 'GET',
				success: function(data) {
					var $data = $(data);
					var remoteTop = $data.find('#top');

					cache[url].className = remoteTop.attr('class');
					top.attr('class', cache[url].className);
					document.title = cache[url].title = $data.filter('title').html();

					cache[url].data.html(remoteTop.html())
						  .appendTo(top)
						  .fadeIn();

					$data.filter('script').each(function(){
				   		$.globalEval(this.text || this.textContent || this.innerHTML || '');
					});
				}
			});

			loaders.hide();
		}

		if ((window.location.pathname.length > 1 || url) && url != '/index.html')
			top.slideDown();
		else
			top.slideUp();
	});

	$(window).trigger('hashchange');
});
