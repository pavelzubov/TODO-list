<?php
	$dbServer="localhost";
	$dbUser="";
	$dbPassword="";
	$dbDatabase="";
	$db=@mysql_connect($dbServer,$dbUser,$dbPassword);
	mysql_query("SET character_set_client='UTF-8'");
	mysql_query("SET character_set_results='UTF-8'");
	mysql_query("SET character_set_connection='UTF-8'");
	mysql_query("SET collation_connection='UTF-8'");

	$data=file_get_contents("php://input");
	if(!$data)exit();
	if(!$db){
		echo mysql_error();
		exit();
	}

	if(!@mysql_select_db($dbDatabase,$db)){
		echo mysql_error();
		exit();
	}
	$sql = "UPDATE tm SET data='".$data."'";
	if(!mysql_query($sql))
	{echo mysql_error();} 
	else 
	{echo '<center>“спешно</center>';}
?>