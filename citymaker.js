config = {
    // set this to your GeoNames User ID!
    geonamesUser: 'mattwigway'
}

$(document).ready(function () {
    var projections = {
        data: new OpenLayers.Projection('EPSG:4326'),
        map: new OpenLayers.Projection('EPSG:3857')
    };

    var state = {
        geonameid: null,
        group: '',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        slug: '',
        name: ''
    };

    var updateOutput = function () {
        state.group = $('#region').val();
        state.slug = $('#slug').val();
        state.name = $('#name').val();

        $('#line').text(state.group + '	' + state.geonameid + '	' + state.top + '	' + state.left + '	' + state.bottom + 
                    '	' + state.right + '	' + state.slug + '	' + state.name);
    }

    // init map
    var map = new OpenLayers.Map('map');
    var osmLayer = new OpenLayers.Layer.OSM();
    map.addLayer(osmLayer);
    map.zoomToMaxExtent();

    // this code is lifted, with slight modifications, from http://openlayers.org/dev/examples/custom-control.html
    var control = new OpenLayers.Control();
    OpenLayers.Util.extend(control, {
        draw: function () {
            var box = new OpenLayers.Handler.Box (
                control,
                {"done": function (bounds) {
                    var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom))
                        .transform(projections.map, projections.data); 
                    var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top))
                        .transform(projections.map, projections.data); 

                    state.left = ll.lon.toFixed(3);
                    state.right = ur.lon.toFixed(3);
                    state.top = ur.lat.toFixed(3);
                    state.bottom = ll.lat.toFixed(3);
                    updateOutput();
                }},
                {keyMask: OpenLayers.Handler.MOD_CTRL}
            );
            box.activate();
        }
    });     

    map.addControl(control);

    // do a geonames search
    $('#search').submit(function (e) {
        e.preventDefault();
        var request = {
            q: $('#search input').val(),
            maxRows: 20,
            // tighter matches
            isNameRequired: true,
            username: config.geonamesUser
        };
        
        $.ajax({
            url: 'http://api.geonames.org/searchJSON',
            data: request,
            dataType: 'jsonp',
            success: function (data) {
                console.log('successfully found ' + data.totalResultsCount + 'results, ' + data.geonames.length + ' returned.');
                $('#searchBox ul li').remove();
                $.each(data.geonames, function () {
                    var item = this;
                    // get it in the closure
                    var id = item.geonameId;
                    var html = $('<li><a href="#">' + item.geonameId + ' ' + item.fcodeName  + ' ' + item.name + ', ' + item.adminName1 + '</a></li>')
                        .click(function (e) {
                            e.preventDefault();
                            console.log('setting state ' + item.geonameId);
                            state.geonameid = id;
                            updateOutput();
                            map.setCenter(new OpenLayers.LonLat(item.lng, item.lat)
                                          .transform(projections.data, projections.map), 10);
                            $('#searchBox').fadeOut();
                        });
                    $('#searchBox ul').append(html);
                });
                $('#searchBox').fadeIn();
            }
        });
    });

    $('#name').change(function (e) {
        updateOutput();
    });

    $('#slug').change(function (e) {
        updateOutput();
    });

    $('#region').change(function (e) {
        updateOutput();
    });
});                    

             
            