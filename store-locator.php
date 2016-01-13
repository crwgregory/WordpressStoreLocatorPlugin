<?php
/*
Plugin Name: Store Locator
Description: Plugin used for adding a store locator to your wordpress site.
Version:     1.0.0
Author:      Chris Gregory
Author URI:  crwgregory.com
*/

global $googleMapUrl;
$googleMapAPIKey = 'AIzaSyAEIHOkkGFCbEuk5ibFD_XLstQUpC27SPA';
$googleMapUrl = sprintf('//maps.googleapis.com/maps/api/js?key=%s&libraries=places', $googleMapAPIKey);

add_action('admin_menu', 'store_locator_admin');
add_action('admin_enqueue_scripts', 'enqueue');
add_action('wp_ajax_add_location', 'add_location_callback');
add_action('wp_ajax_load_locations', 'load_locations_callback');
add_action('wp_ajax_delete_locations', 'delete_locations_callback');

register_activation_hook( __FILE__, 'create_location_table' );

function enqueue(){
	global $googleMapUrl;
	wp_enqueue_style( 'style', plugins_url('style.css', __FILE__));
	wp_enqueue_script( 'googleMapsAPI', $googleMapUrl);
	wp_enqueue_script( 'script', plugins_url( '/js/admin.js', __FILE__ ), array('jquery') );
	wp_localize_script( 'script', 'ajax_object',
            array( 'ajax_url' => admin_url( 'admin-ajax.php' )));
}

function load_locations_callback(){
	global $wpdb;
	printLocationsJson($wpdb);
	wp_die();
}

function delete_locations_callback(){
	global $wpdb;
	$count = 0;
	//delete rows
	$rows = $_POST["rows"];
	foreach($rows as $row){		
		$wpdb->delete( 'wp_location_table', array( 'id' => $row ) );
		$count++;
	}
	printLocationsJson($wpdb);
	wp_die();
}

function add_location_callback(){
	global $wpdb;
	$name = $_POST["name"];
	$address = $_POST["address"];
	$lat = $_POST["lat"];
	$lng = $_POST["lng"];
	$data = array(
		'name' => $name,
		'address' => $address,
		'lat' => $lat,
		'lng' => $lng);
	$wpdb->insert('wp_location_table', $data);
	printLocationsJson($wpdb);
	wp_die();
}

function printLocationsJson($wpdb){
	include 'phpsqlsearch_genjson.php';
	print(getAllLocations());
}

function updateLocationList($wpdb){
	
}

function store_locator_admin(){
	add_menu_page('Store Locator Admin Console', 'Store Locator', 'administrator', 'store-locator-console', 'print_store_locator', 'dashicons-admin-generic');
}

function print_store_locator(){
	require('admin-control.html');
}

function create_location_table(){
	global $wpdb;
	$table_name = $wpdb->prefix . 'location_table';

	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE $table_name (	  
	  id int PRIMARY  KEY  NOT NULL AUTO_INCREMENT,
	  name varchar(60) NOT NULL,
	  address varchar(80) NOT NULL,
	  lat float(10,6) NOT NULL,
	  lng float(10,6) NOT NULL
	) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
}

?>