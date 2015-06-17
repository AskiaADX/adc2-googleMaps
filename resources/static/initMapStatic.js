function initialize() {

  for(var mapIndex = 0; mapIndex<resources.length; mapIndex++){

    console.log("initialize "+mapIndex);
    var mapSet = resources[mapIndex];

  	//mapSet["map"] initialization
    var mapProp = {
      center:new google.maps.LatLng(mapSet["startingLat"],mapSet["startingLng"]),
      zoom:mapSet["startingZoom"],
      mapTypeId:mapSet["mapStyle"]
    };

    console.log("adding the map to the DOM");

    var mapId = "googleMap"+mapSet["adcId"];
    mapSet["map"]=new google.maps.Map(document.getElementById(mapId), mapProp);
    console.log("added the map to the DOM");
    mapSet["map"].id = mapIndex;

    if(mapSet["startAtCurrentPos"]){
      console.log("startAtCurrentPos");
      // Try HTML5 geolocation
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var curPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    	  mapSet["map"].setCenter(curPos);
        },
    	function() {
          handleNoGeolocation(true,mapIndex);
        });
      } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false,mapIndex);
      }
    }

    if(mapSet["multipleMarkers"]){
      var prevPositionM = [];
      for(var i=0;i<mapSet["nbMarkers"];i++){
        if($("#"+mapSet["marker"][i].latInputName).val() != ""){
          prevPositionM[i]= new google.maps.LatLng(
            $("#"+mapSet["marker"][i].latInputName).val(),
            $("#"+mapSet["marker"][i].lngInputName).val()
          );
          mapSet["marker"][i].setPosition(prevPositionM[i]);
          mapSet["marker"][i].setMap(mapSet["map"]);
          mapSet["map"].panTo(prevPositionM[i]);//and pan to it.
          //TODO pan to a position where we can see all the markers
          //add the delete listener
          google.maps.event.addListener(mapSet["marker"][i], 'click', function(event) {//delete the clicked marker
            $("#"+this.latInputName).val('');
            $("#"+this.lngInputName).val('');
            this.setMap(null);
          });
        }
      }
    }else{

        if($("#"+mapSet["qLngInputName"]).val() != ""){//remember the previous answer if it exists
      		var prevPosition =  new google.maps.LatLng(
      			$( "#"+mapSet["qLatInputName"] ).val(),
      			$("#"+mapSet["qLngInputName"]).val()
      		);
          // if previously answered, put the marker at the position of the answer
          mapSet["marker"].setPosition(prevPosition);
          mapSet["marker"].setMap(mapSet["map"]);
          mapSet["map"].panTo(prevPosition);//and pan to it.
      	}

      //add an event to delete the marker
      google.maps.event.addListener(mapSet["marker"], 'click', function() {
         deleteMarker(mapSet["adcId"]-1);
      });
    }
    // add the placeMarker listener on the map
    google.maps.event.addListener(mapSet["map"], 'click', function(e) {
      placeMarker(e.latLng, this.id);
    });

  }
//fin foreach map
  console.log("initialization finished");
}

function handleNoGeolocation(errorFlag, mapIndex) {
  var mapSet = resources[mapIndex];
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  if (mapSet["errorDisplayMode"]=="div") {
    $("#adc_"+mapSet["adcId"]).append("<div class='noGeoError'>"+content+"</div>");
    console.log(content);
  } else if (mapSet["errorDisplayMode"]=="alert") {
    alert(content);
    console.log(content);
  } else if (mapSet["errorDisplayMode"]=="console") {
    console.log(content);
  }
}


function placeMarker(position, mapIndex) {//place or move the marker on click
  var mapSet = resources[mapIndex];
  console.log("placeMarker "+mapIndex);
  if(mapSet["multipleMarkers"]){
    //find an empty cell in the array
      var i=0;
      var cont=true;
      do{
        if(mapSet["marker"][i].map==null){
          console.log("empty cell found "+i);
          mapSet["marker"][i].setMap(mapSet["map"]);
          mapSet["marker"][i].setPosition(position);
          cont=false;
        }
        i++;
      }while(cont && i<mapSet["nbMarkers"]);

      if(!cont){
        //add the markers' coordinates to the inputs fields generated
        $("#"+mapSet["marker"][i-1].latInputName).val(position.lat());
        $("#"+mapSet["marker"][i-1].lngInputName).val(position.lng());//and record the position in the input
        //and to the map
        mapSet["map"].panTo(position);
        google.maps.event.addListener(mapSet["marker"][i-1], 'click', function(event) {//delete the clicked marker
          $("#"+mapSet["marker"][i-1].latInputName).val('');
          $("#"+mapSet["marker"][i-1].lngInputName).val('');
          mapSet["marker"][i-1].setMap(null);
        });

    }else{
      alert("No more markers to place, please delete one of the existant before adding a new one.")
    }
  }else{
  	$( "#"+mapSet["qLatInputName"] ).val(position.lat());
  	$( "#"+mapSet["qLngInputName"] ).val(position.lng());//and record the position in the input
    mapSet["marker"].setMap(mapSet["map"]);
  	mapSet["marker"].setPosition(position);
  	mapSet["map"].panTo(position);
  }
}
function deleteMarker(mapIndex){
  var mapSet = resources[mapIndex];
	$("#"+mapSet["qLatInputName"]).val('');
	$("#"+mapSet["qLngInputName"]).val('');
	mapSet["marker"].setMap(null);
}


function setCurPos(mapIndex){
  console.log("setCurPos");
  var mapSet = resources[mapIndex];
	  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var curPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	  placeMarker(curPos, mapIndex);
    },
	function() {
      handleNoGeolocation(true, mapIndex);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false, mapIndex);
  }
}
