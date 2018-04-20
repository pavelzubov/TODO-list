<?php
	$dbServer="localhost";
	$dbUser="u0080754_topaz_1";
	$dbPassword="dkcV55lK";
	$dbDatabase="u0080754_topaz_3";
	$db=@mysql_connect($dbServer,$dbUser,$dbPassword);
	mysql_query("set character_set_client='cp1251'");
	mysql_query("set character_set_results='cp1251'");
	mysql_query("set collation_connection='cp1251_general_ci'");

	if(!$db){
		echo mysql_error();
		exit();
	}

	if(!@mysql_select_db($dbDatabase,$db)){
		echo mysql_error();
		exit();
	}
	$sql = "UPDATE tm SET data='".iconv('UTF-8','cp1251',$_POST['submit'])."'";
	if(!mysql_query($sql))
	{echo mysql_error();} 
	else 
	{echo '<center>Успешно</center>';}
?>