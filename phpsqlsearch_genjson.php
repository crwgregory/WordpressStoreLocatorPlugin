<?php

class Location{
	public $id;
	public $name;
	public $address;
	public $lat;
	public $lng;
}

header("Content-type: application/json");

function getAllLocations(){
	global $wpdb;
	$location_table = $wpdb->get_results('SELECT * FROM wp_location_table');
	$locations = array(count($location_table));
	foreach($location_table as $row){
		$location = new Location();
		$location->id = $row->id;
		$location->name = $row->name;
		$location->address = $row->address;
		$location->lat = $row->lat;
		$location->lng = $row->lng;
		array_push($locations, $location);
	}
	return json_encode($locations);	
}


?>