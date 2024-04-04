<?php

$servername = "oceanus.cse.buffalo.edu:3306"; // enter servername
$username = "jiewenhu"; // enter ubit
$password = "50343451"; // enter UB ID number
$dbname = "cse442_2024_spring_team_ac_db"; // enter database name

// Prevent XSS attacks
header('X-XSS-Protection: 1; mode=block');

// Prevent Clickjacking
header('X-Frame-Options: DENY');

// Prevent MIME type sniffing
header('X-Content-Type-Options: nosniff');