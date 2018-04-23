<?php
	$dbServer="localhost";
	$dbUser="";
	$dbPassword="";
	$dbDatabase="";
	$db=@mysql_connect($dbServer,$dbUser,$dbPassword);
	mysql_query("SET character_set_client='UTF-8_general_ci'");
	mysql_query("SET character_set_results='UTF-8_general_ci'");
	mysql_query("SET character_set_connection='UTF-8_general_ci'");
	mysql_query("SET collation_connection='UTF-8_general_ci'");

	if(!$db){
		echo mysql_error();
		exit();
	}

	if(!@mysql_select_db($dbDatabase,$db)){
		echo mysql_error();
		exit();
	}
	$data=mysql_fetch_array(mysql_query("SELECT * FROM tm"));
	echo $data["data"];
?>