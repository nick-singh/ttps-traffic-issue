// The Template Loader. Used to asynchronously load templates located in separate .html files
TRACKER.templateLoader = {

    load: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (TRACKER.Views[view]) {// originally was window[view]
                deferreds.push($.get('templates/' + view + '.html', function(data) {
                    TRACKER.Views[view].prototype.template = _.template(data);// originally was window[view]
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};