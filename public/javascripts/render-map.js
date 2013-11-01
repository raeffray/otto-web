        var geocoder;
        var map;
        var centre;
        var marker;

        alert(quotations.length);

        function getLocation() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
          }
          else {
            x.innerHTML="Geolocation is not supported by this browser.";
            setControls();
          }
        }

        function showPosition(position) {
          centre = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
          setControls();
        }

        function initialize() {

          getLocation();  

          
        }

        function setControls(){

          geocoder = new google.maps.Geocoder();
          
          var mapOptions = {
            zoom: 14,
            center: centre,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }

        

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            for (var i = 0; i < quotations.length ; i++) {

                var q = quotations[i];

                    var point = new google.maps.LatLng(q.station.address.lat, q.station.address.lng);

                    var infowindow = new google.maps.InfoWindow(); 

                    marker = new google.maps.Marker({
                        map:map,
                        draggable:false,
                        animation: google.maps.Animation.DROP,
                        position:  point,
                        title: 'Posto ' + q.station.name + ' Endereco' + q.station.normalizedAddress + ' preco' + q.station.sellingPrice + ' combustivel' + q.fuel
                    });
                
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setCenter(new google.maps.LatLng(marker.position.lat(), marker.position.lng())); 
                        onItemClick(event, marker); 
                    });    
                    
                    function onItemClick(event, pin) { 
                    // Create content  
                        var contentString = "<br/>Posto: "; 

                    // Replace our Info Window's content and position 
                        infowindow.setContent(contentString); 
                        infowindow.setPosition(pin.position); 
                        infowindow.open(map) 
                }

                  

            };
        }

        function codeAddress() {
          var address = document.getElementById('address').value;
          geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              map.setCenter(results[0].geometry.location);
              var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
              });
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
        }

        function toggleBounce() {

          if (marker.getAnimation() != null) {
             marker.setAnimation(null);
          } else {
             marker.setAnimation(google.maps.Animation.BOUNCE);
          }
        }


        google.maps.event.addDomListener(window, 'load', initialize);