// Goddamn global variable
var prices = new Object();

function createMarker(mappedPrice, map, infoWindow){

    var point = new google.maps.LatLng(mappedPrice.localization[0], mappedPrice.localization[1]);

    var labelFuel = mappedPrice.fuel[0].fuel.substring(4,5) + ' ' + mappedPrice.fuel[0].sellingPrice;

    var marker = new MarkerWithLabel({
       position: point,
       map: map,
       draggable: false,
       icon: '/images/pump-marker.png',
       labelContent: labelFuel,
       labelAnchor: new google.maps.Point(3, 30),
       labelClass: "labels", // the CSS class for the label
       labelInBackground: false
     });

    google.maps.event.addListener(marker, "click", displayGasStationDetails(marker, mappedPrice, map, infoWindow));
    
    return marker;
}

function displayGasStationDetails(marker, mappedPrice, map, infoWindow){
     return function(){

        infoWindow.close();

        $("#dtl_name").text(mappedPrice.station.name);
        $("#dtl_address").text(mappedPrice.station.normalizedAddress);

        for(var i=0;i<mappedPrice.fuel.length;i++){
            var fuel = mappedPrice.fuel[i];

            if (fuel.fuel.indexOf('Gasolina')!=-1) {
                //alert(fuel.sellingPrice);
                $("#dtl_gas").text(fuel.sellingPrice)
            } else if(fuel.fuel.indexOf('Etanol')!=-1){
                $("#dtl_alc").text(fuel.sellingPrice)
            } else if(fuel.fuel.indexOf('Diesel')!=-1){
                $("#dtl_die").text(fuel.sellingPrice)
            } else if(fuel.fuel.indexOf('GNV')!=-1){
                $("#dtl_gnv").text(fuel.sellingPrice)
            } else if(fuel.fuel.indexOf('GLP')!=-1){
                $("#dtl_glp").text(fuel.sellingPrice)
            };
        }

        var windowOpts = {
            "pixelOffset": new google.maps.Size(-2, -2),
            content: $("#price_details").clone().html()
        };

        infoWindow.setOptions(windowOpts);

        infoWindow.open(map, marker); 

        //marker.openInfoWindowHtml($("#price_details").clone().html(), windowOpts);
    } 
}

function logEvent(message){
    // document.getElementById("last_event").innerHTML += "<br/>" +
    // message;
    $("#last_event").append("<br/>" + message);
}

function createMarkersFromPriceMap(priceMap,map,infoWindow){

    var markers = new Array();
    for (var i = 0, item; item = priceMap[i]; i++) {
        //if (!prices["" + item.id]) {
            markers.push(createMarker(item,map,infoWindow));
            prices["" + item.id] = item;
        //}
    }
    return markers;
}

function fetchPriceMap(map, infoWindow){
    if (map.getZoom() >= 13) {
        var bounds = map.getBounds();
        var params = {
            swLat: bounds.getSouthWest().lat(),
            swLng: bounds.getSouthWest().lng(),
            neLat: bounds.getNorthEast().lat(),
            neLng: bounds.getNorthEast().lng(),
        };
        var url = "/data?" + jQuery.param(params);

        $.getJSON(url, function(result){

            var markers = createMarkersFromPriceMap(result,map, infoWindow);
            
            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(map);
            }
        });
    }
}

function initialize(){

    var infoWindow = new google.maps.InfoWindow();

    if (window.location.hash == "#debug") {
        $("#debug").show();
        $("#disclaimer").hide();
    }
    else {
        $("#debug").hide();
        $("#disclaimer").show();
    }
    
    var clientLocation = google.loader.ClientLocation;
    
        var mapCenter; 

        if (clientLocation) {
            mapCenter = new google.maps.LatLng(clientLocation.latitude, clientLocation.longitude);
        }
        else {
            mapCenter = new google.maps.LatLng(-23.5643768, -46.671688);
        }

        var mapOptions = {
            zoom: 15,
            center: mapCenter,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions,function(){
            fetchPriceMap(map,infoWindow);
        });
        
        google.maps.event.addListener(map, 'idle', function() {
            fetchPriceMap(map,infoWindow);
        });
        
        google.maps.event.addListener(map, "click", function(overlay, latlng){
            if (overlay) {
                // ignore if we click on the info window
                return;
            }
            var tileCoordinate = new GPoint();
            var tilePoint = new GPoint();
            var currentProjection = G_NORMAL_MAP.getProjection();
            tilePoint = currentProjection.fromLatLngToPixel(latlng, map.getZoom());
            tileCoordinate.x = Math.floor(tilePoint.x / 256);
            tileCoordinate.y = Math.floor(tilePoint.y / 256);
            var myHtml = "Latitude: " + latlng.lat() + "<br/>Longitude: " + latlng.lng() +
            "<br/>The Tile Coordinate is:<br/> x: " +
            tileCoordinate.x +
            "<br/> y: " +
            tileCoordinate.y +
            "<br/> at zoom level " +
            map.getZoom();
            logEvent(myHtml);
        });
    
}
