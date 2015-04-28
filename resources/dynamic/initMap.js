

{%
	Dim ar
	Dim qFinputName
	Dim qSinputName
	Dim qFinputValue
	Dim qSinputValue
	Dim adcId

	ar = CurrentQuestion.ParentLoop.AvailableResponses
	qFinputName = CurrentQuestion.Iteration(ar[1].Index).InputName()
	qSinputName = CurrentQuestion.Iteration(ar[2].Index).InputName()
	qFinputValue = CurrentQuestion.Iteration(ar[1].Index).InputValue()
	qSinputValue = CurrentQuestion.Iteration(ar[2].Index).InputValue()
	adcId = CurrentADC.InstanceID



Dim mapStyle =CurrentADC.PropValue("mapStyle")

Dim startingLat =CurrentADC.PropValue("startingLat")
Dim startingLng =CurrentADC.PropValue("startingLng")
Dim startingZoom =CurrentADC.PropValue("startingZoom")
%}

function initialize() {
	
  	if($( "#{%= qSinputName %}" ).val() != ""){//remember the previous answer if it exists
		var prevPosition{%= adcId %} =  new google.maps.LatLng(
			$( "#{%= qFinputName %}" ).val(),
			$( "#{%= qSinputName %}" ).val()
		);
	}
	
	//map{%= adcId %} initialization
  var mapProp = {
    center:new google.maps.LatLng({%= startingLat %},{%= startingLng %}),
    zoom:{%= startingZoom %},
    mapTypeId:google.maps.MapTypeId.{%= mapStyle %}
  };
  var map{%= adcId %}=new google.maps.Map(document.getElementById("googleMap{%= adcId %}"), mapProp);

  
  //initialization of the marker
  marker{%= adcId %} = new google.maps.Marker({
	map: map{%= adcId %},
  });
  //if previously answered, put the marker at the position of the answer
  	if($( "#{%= qSinputName %}" ).val() != ""){
		marker{%= adcId %}.setPosition(prevPosition{%= adcId %});
		map{%= adcId %}.panTo(prevPosition{%= adcId %});//and pan to it.
	}
	
  //add the placeMarker listener
  google.maps.event.addListener(map{%= adcId %}, 'click', function(e) {
    placeMarker{%= adcId %}(e.latLng, map{%= adcId %});
  });
}

function placeMarker{%= adcId %}(position, map) {//move the marker on click (one function per ADC instance)
	$( "#{%= qFinputName %}" ).val(position.lat());
	$( "#{%= qSinputName %}" ).val(position.lng());//and record the position in the input
		marker{%= adcId %}.setPosition(position);
		map.panTo(position);
}
google.maps.event.addDomListener(window, 'load', initialize);//go