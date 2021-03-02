<?php
  $servername = "localhost";
  $port = 8889;
  $username = "root";
  $password = "root";
  $dbname = "dstl";

  $dsn        = "mysql:host=$host;dbname=$dbname";
  $options    = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
              );
?>
