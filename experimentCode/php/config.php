<?php

  $servername = "localhost";
  $port = 8889; // not important as long as in severname (for localhost)
  $username = "root";
  $password = "root";
  $dbname = "dstl";

  // $host       = "db5001866455.hosting-data.io";
  // $username   = "dbu981803";
  // $password   = "Tjotssw1_dstl07";
  // $dbname     = "dbs1532470";
  // $port       = 3306;
  $dsn        = "mysql:host=$host;dbname=$dbname";
  $options    = array(
                  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                );

  $table      = "data";
?>
