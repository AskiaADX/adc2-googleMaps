{%
Dim i
Dim j
Dim inputName
Dim inputValue
Dim ar1 = CurrentQuestion.ParentLoop.ParentLoop.AvailableResponses
Dim ar2 = CurrentQuestion.ParentLoop.AvailableResponses
Dim adcId = CurrentADC.InstanceID
%}

console.log("boucleFor AS");
{%
  For i = 1 To ar1.Count
  	For j = 1 to ar2.count
    	inputName = CurrentQuestion.Iteration(loop:i,loop2:j).InputName()
    	inputValue = CurrentQuestion.Iteration(loop:i,loop2:j).InputValue() %}


      {% If i = 1 Then %}
      resources[resIndex]["marker"][{%= j-1 %}] = new google.maps.Marker();
      resources[resIndex]["marker"][{%= j-1 %}].latInputName = "{%= inputName %}";
      {% ElseIf i = 2 Then %}
      resources[resIndex]["marker"][{%= j-1 %}].lngInputName = "{%= inputName %}";
      {% Else %}
        console.log("Error in the question order.");
      {% EndIf %}

	{% Next%}
{% Next %}
