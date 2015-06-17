{%

	Dim adcId = CurrentADC.InstanceID

  Dim mapStyle =CurrentADC.PropValue("mapStyle")
	Dim ar = CurrentQuestion.ParentLoop.AvailableResponses
	Dim qLatInputName
	Dim qLngInputName
	Dim qLatInputValue
	Dim qLngInputValue
  Dim startAtCurrentPos = (CurrentADC.PropValue("startAtCurrentPos") = "1")
  Dim startingLat =CurrentADC.PropValue("startingLat")
  Dim startingLng =CurrentADC.PropValue("startingLng")
  Dim startingZoom =CurrentADC.PropValue("startingZoom")

	Dim errorDisplayMode =CurrentADC.PropValue("errorDisplayMode")

	Dim multipleMarkers = (CurrentADC.PropValue("multipleMarkers") = "1")
	Dim nbMarkers =CurrentADC.PropValue("nbMarkers")

	If Not(multipleMarkers) Then
		ar = CurrentQuestion.ParentLoop.AvailableResponses
		qLatInputName = CurrentQuestion.Iteration(ar[1].Index).InputName()
		qLngInputName = CurrentQuestion.Iteration(ar[2].Index).InputName()
		qLatInputValue = CurrentQuestion.Iteration(ar[1].Index).InputValue()
		qLngInputValue = CurrentQuestion.Iteration(ar[2].Index).InputValue()
	EndIf %}

{% If adcId < 2 Then %}
var resources = [];
{% EndIf %}

var resIndex = {%= adcId %}-1;

console.log("generating resources");
resources[resIndex]= {

      "adcId" : Number({%= adcId %}),
      "mapStyle" : "{%= mapStyle %}",
      "startingLat" : Number({%= startingLat %}),
      "startingLng" : Number({%= startingLng %}),
      "startingZoom" : Number({%= startingZoom %}),
      "startAtCurrentPos" : Boolean({%= startAtCurrentPos %}),
		{% If multipleMarkers Then %}
      "marker" : [],
    {% Else %}
			"marker" : new google.maps.Marker(),
      "qLatInputName" : "{%= qLatInputName %}",
      "qLngInputName" : "{%= qLngInputName %}",
      "qLatInputValue" : Number({%= qLatInputValue %}),
      "qLngInputValue" : Number({%= qLngInputValue %}),
		{% EndIf %}

			"errorDisplayMode" : "{%= errorDisplayMode %}",
			"multipleMarkers" : Boolean({%= multipleMarkers %}),
			"nbMarkers" : Number({%= nbMarkers %})

};
{% If multipleMarkers Then %}
{%:= CurrentADC.GetContent("dynamic/standard_multiple_loop.js").ToText()%}

{% EndIf %}

console.log(resources);

google.maps.event.addDomListener(window, 'load', initialize);
console.log("dom listener added");
// ("mapSet{%= adcId %}")
