<?php
$servername = ""; // server name
$username = ""; // UBIT
$password = ""; // UB ID
$dbname = ""; // database name
// Prevent XSS attacks
header('X-XSS-Protection: 1; mode=block');

// Prevent Clickjacking
header('X-Frame-Options: DENY');

// Prevent MIME type sniffing
header('X-Content-Type-Options: nosniff');
