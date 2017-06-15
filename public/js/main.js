/*eslint-env browser */
var root = angular.module('root', ['watsonModule']);

//main controller
root.controller('controllerCog', function ($scope, watsonVr){
	
	
});

$().ready(function(){

	$( "#send_file" ).submit(function(event) {
			event.preventDefault();
		var formData = new FormData($(this)[0]);
		
		$.ajax({
			type: "POST",
	        url : "test",
	        data: formData,
	        contentType: false,
	        processData: false,
	        dataType: "json",
	        success : function(response) {
				alert("response: " + JSON.stringify(response));
	        },
	        error : function(request, textStatus, errorThrown) {
	            alert(request.status + ', Error: ' + request.statusText);
	             // perform tasks for error 
	        }
		});
	
	});
});