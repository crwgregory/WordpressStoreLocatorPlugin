var autocomplete;
jQuery(document).ready(function(){
	//autoComplete();
	jQuery.ajax({
		url: ajax_object.ajax_url,
		method: 'POST',
		data: {
			action: 'load_locations'
		},
		success: function(data){
			printLocations(data);
		}
	});
})

function newLocation(){
	var name, address, geocoder;
	name = document.getElementById('location-form-name').value;
	address = document.getElementById('location-form-address').value;	
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({address: address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	    	var lat, lng;
			//round numbers so that they can only have 6 decimals
			lat = Math.round(results[0].geometry.location.lat() * 1000000) / 1000000; 
			lng = Math.round(results[0].geometry.location.lng() * 1000000) / 1000000;
			checkValues(name, address, lat, lng);
			console.log(lat + ":" + lng);
	    } else {
			alert('Sorry, there\'s no pizza near ' +address + '!');
	    }
  	});  	
}

function autoComplete(){
	var input = document.getElementById('location-form-address');
	var options = {
		types: ['establisments']
	};
	autocomplete = new google.maps.places.Autocomplete(input, options);
	autocomplete.getPlace();
}

function checkValues(name, address, lat, lng){
	var formContainer, check, title, info, submit;

	var checkContainer = document.getElementById('information-check');
	if(checkContainer){
		checkContainer.parentNode.removeChild(checkContainer);		
	}
	formContainer = document.getElementById('new-location-container');
  	check = document.createElement('div');
  	check.setAttribute('id', 'information-check');
  	title = document.createElement('h3');
  	title.innerHTML = 'Is this information correct?';
  	info = document.createElement('p');
  	info.innerHTML = 'Name: ' + name +"<br>" +
  		'Address: ' + address +"<br>" +
  		'(Latitude: ' + lat +
  		' Longitude: ' + lng +")<br>";
	submit = document.createElement('button');
	submit.setAttribute('type', 'button');
	submit.setAttribute('onclick', 'saveLocation("'+ name + '", "' + address + '", ' + lat + ', ' + lng  +');');
	submit.setAttribute('id', 'submit');
	submit.innerHTML = 'Yes this information is correct.';
	check.appendChild(title);
	check.appendChild(info);
	check.appendChild(submit);
	formContainer.appendChild(check);
}

function saveLocation(locName, locAddress, locLat, locLng){
	var checkContainer = document.getElementById('information-check');
	document.getElementById('new-location-form').reset();
	checkContainer.parentNode.removeChild(checkContainer);
	jQuery.ajax({
		url: ajax_object.ajax_url,
		method: 'POST',
		data: {
			action: 'add_location',
			type: 'new',
			name: locName,
			address: locAddress,
			lat: locLat,
			lng: locLng
		},
		success: function(data){
			printLocations(data);
		}
	});
}

function printLocations(jsonData){
	var oldLocationsTable = document.getElementById('store-locations');
	var newLocationTable = document.createElement('tbody');
	newLocationTable.setAttribute('id', 'store-locations');
	for(var i = 1; i < jsonData.length; i++){
		// Create new table row and add table data
		var row = document.createElement('tr');
		var tdCheckbox = document.createElement('td');
		var checkbox = document.createElement('input');
		var tdName = document.createElement('td');
		var tdAddress = document.createElement('td');

		tdName.innerHTML = jsonData[i].name;
		tdAddress.innerHTML = jsonData[i].address;

		jQuery(tdCheckbox).addClass('select');
		tdCheckbox.appendChild(checkbox);
		checkbox.setAttribute('type', 'checkbox');
		checkbox.setAttribute('name', 'row');
		checkbox.setAttribute('value', jsonData[i].id);

		row.appendChild(tdCheckbox);
		row.appendChild(tdName);
		row.appendChild(tdAddress);
		newLocationTable.appendChild(row);
	}
	oldLocationsTable.parentNode.replaceChild(newLocationTable, oldLocationsTable);
}

function deleteLocations(){
	var rowsArray = [];
	var boxes = getCheckedBoxes('row');
	if(boxes != null){		
		for(var i = 0; i < boxes.length; i++){
			rowsArray.push(boxes[i].value);			
		}
	} else {
		alert('Nothing selected.');
	}	
	jQuery.ajax({
		url: ajax_object.ajax_url,
		method: 'POST',
		data: {
			action: 'delete_locations',
			rows: rowsArray
		},
		success: function(data){
			printLocations(data);
		}
	});
}

function getCheckedBoxes(chkboxName){
	var checkboxes = document.getElementsByName(chkboxName);
	var checkedboxes = [];
	for(var i = 0; i < checkboxes.length; i++){
		if(checkboxes[i].checked){
			checkedboxes.push(checkboxes[i]);
		}
	}
	return checkedboxes.length > 0 ? checkedboxes : null;
	//return 1;
}
