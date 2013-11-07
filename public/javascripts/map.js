// Goddamn global variable
var prices = new Object();

function createMarker(mappedPrice, icon){

    var point = new google.maps.LatLng(mappedPrice.localization[0], mappedPrice.localization[1]);


    markerOpts = {
        "title": mappedPrice.station.name,
        "icon": icon,
        "clickable": true,
        "labelText": mappedPrice.fuel[0].sellingPrice,
        "labelOffset": new GSize(-0, -18)
    };
    var marker = new LabeledMarker(point, markerOpts);
    
    GEvent.addListener(marker, "click", function(){
        var id = mappedPrice.id;
        logEvent("click: id=" + id);
        
    });
    
    GEvent.addListener(marker, "click", displayGasStationDetails(marker, mappedPrice));
    
    var oldZIndex = 0;
    
    GEvent.addListener(marker, "mouseover", function(){
        oldZIndex = this.div_.style.zIndex;
        // Traz o preço p/ frente
        this.div_.style.zIndex = 99999999;
    });
    
    GEvent.addListener(marker, "mouseout", function(){
        this.div_.style.zIndex = oldZIndex;
    });
    
    return marker;
}

function displayGasStationDetails(marker, mappedPrice){
    return function(){
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
            "noCloseOnClick": false,
            "pixelOffset": new GSize(-38, -17),
        };
        marker.openInfoWindowHtml($("#price_details").clone().html(), windowOpts);
    }
}

function logEvent(message){
    // document.getElementById("last_event").innerHTML += "<br/>" +
    // message;
    $("#last_event").append("<br/>" + message);
}

function createMarkersFromPriceMap(priceMap, icon){
    var markers = new Array();
    for (var i = 0, item; item = priceMap[i]; i++) {
        //if (!prices["" + item.id]) {
            markers.push(createMarker(item, icon));
            prices["" + item.id] = item;
        //}
    }
    return markers;
}

function fetchPriceMap(map, icon){
    var bounds = map.getBounds();
    var params = {
        swLat: bounds.getSouthWest().lat(),
        swLng: bounds.getSouthWest().lng(),
        neLat: bounds.getNorthEast().lat(),
        neLng: bounds.getNorthEast().lng(),
    };
    var url = "/data?" + jQuery.param(params);

    logEvent("Fetching: " + url);
    $.getJSON(url, function(result){

        var markers = createMarkersFromPriceMap(result, icon);
        
        for (var i = 0, marker; marker = markers[i]; i++) {
            map.addOverlay(marker);
        }
    });
}

function initialize(){

    if (window.location.hash == "#debug") {
        $("#debug").show();
        $("#disclaimer").hide();
    }
    else {
        $("#debug").hide();
        $("#disclaimer").show();
    }
    
    var clientLocation = google.loader.ClientLocation;
    
        var map = new google.maps.Map(document.getElementById("map_canvas"));

        if (clientLocation) {
            map.setCenter(new google.maps.LatLng(clientLocation.latitude, clientLocation.longitude), 15);
        }
        else {
            map.setCenter(new google.maps.LatLng(-23.5643768, -46.671688), 15);
            //map.setCenter(new google.maps.LatLng(-23.54730726103009, -46.64451599121094), 13);
        }
        
        var icon = new GIcon();
        icon.image = "classic.png";
        //icon.image = "transparent.png";
        icon.iconSize = new GSize(36, 14);
        icon.iconAnchor = new GPoint(0, 19);
        icon.infoWindowAnchor = new GPoint(34, 5);
        
        fetchPriceMap(map, icon);
        
        GEvent.addListener(map, "moveend", function(){
            var message = "moveend:";
            message += "<br/>The new map center is: " + map.getCenter();
            message += "<br/>New bounds are: " + map.getBounds();
            message += "<br/>Zoom level: " + map.getZoom();
            logEvent(message);
            
            if (map.getZoom() >= 13) {
                fetchPriceMap(map, icon);
            }
        });
        
        GEvent.addListener(map, "click", function(overlay, latlng){
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
