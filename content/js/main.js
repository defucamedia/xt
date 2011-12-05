(function(window) {
    var History = window.History;
    
    if (!History.enabled)
        return false;

    History.Adapter.bind(window, "statechange", function() {
        var url = History.getState().url;
	    var $content = $("#container > div");
        var $footer = $("footer");
        var transitionTime = 300;
        
        $footer.fadeOut(transitionTime);
        $content.fadeOut(transitionTime, function() {
            $.get(url, function(html) {
                var $html = $(html);
                var title = $html.filter("title").text();
                var content = $html.filter("#container").children("div");

                $content.replaceWith(content);
                document.title = title;

                $content.fadeIn(transitionTime);
                $footer.fadeIn(transitionTime);
            });
        });        
    });
})(window);

$(function() {
    ajaxy();
});

function ajaxy() {
    if (!History.enabled)
        return false;

    $("#loading").ajaxStart(function() {
		$(this).stop().fadeIn();
	}).ajaxStop(function() {
		$(this).stop().fadeOut();
	});

    $("a[data-role!='external']").live("click", function() {
        var url = this.href;

        if (url)
            History.pushState(null, "", url);

        return false;
    });
}
