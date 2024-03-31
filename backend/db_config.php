<?php
$servername = "oceanus.cse.buffalo.edu";
$username = "";
$password = "";
$dbname = "cse442_2024_spring_team_ac_db";

// Prevent XSS attacks
header('X-XSS-Protection: 1; mode=block');

// Prevent Clickjacking
header('X-Frame-Options: DENY');

// Prevent MIME type sniffing
header('X-Content-Type-Options: nosniff');
