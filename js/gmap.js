      var marker;
      var infowindow;
      var url = '/';

      // Initialize and add the map
      function initMap() {
        // The location of Uluru
        var uluru = {lat: -25.344, lng: 131.036};
        // The map, centered at Uluru
        var map = new google.maps.Map(
            document.getElementById('map'), {zoom: 4, center: uluru});

        map.addListener('click', function(e) {
      
          if (marker) marker.setMap(null);

          infowindow = new google.maps.InfoWindow({
            maxWidth: 400
          });;
          
          marker = new google.maps.Marker({position: e.latLng, map: map, draggable: true});
          marker.addListener('click', function(e) {
            infowindow.setContent( setInfoWindowContent(e.latLng) );
            infowindow.open(map, marker);

            sendCoords(e.latLng);
          });
          
          marker.addListener('drag', function() {
            if (infowindow) infowindow.close();
          });

        });

        function setInfoWindowContent(coords) {
          return '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1>Выбранные координаты:</h1>'+
          '<p>Широта: ' + coords.lat() + '<br>Долгота: ' + coords.lng() + '</p>'+
          '<div style="text-align: center"><button id="sendCoordsBtn" action="sendCoords">Отправить</button>'+
          '</div>'+
          '</div>';
        };

        function sendCoords(coords) {
          var btn = document.getElementById('sendCoordsBtn');
          
          btn.onclick = function () {
            
            var data = {
              lat: coords.lat(),
              lng: coords.lng(),
            };

            const xhr = new XMLHttpRequest();
            xhr.open('post', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
            
            xhr.onreadystatechange = function () {
              if (this.readyState != 4) return;
              
              if (this.status != 200) {
                alert('Ошибка запроса ' + this.status + ': ' + this.statusText);
                return;
              }
              
              if (infowindow) infowindow.close();
              alert('Данные успешно переданы на сервер');
            }
          }
        };
      };