<?php 


add_action('wp_ajax_myaction', 'my_action_callback');

// Get parameters from URL
$name = $_GET["name"];
$address = $_GET["address"];
$lat = $_GET["lat"];
$lng = $_GET["lng"];
function my_action_callback(){
	global $wpdb;
	//$location_table = $wpdb->get_results('SELECT * FROM wp_location_table');
	// $locations = array(count($location_table));
	// foreach($location_table as $row){
	// 	$location = new Location();
	// 	$location->name = $row->name;
	// 	$location->address = $row->address;
	// 	$location->lat = $row->lat;
	// 	$location->lng = $row->lng;
	// 	array_push($locations, $location);
	// }
	print_r($location_table);
	wp_die();
}

?>