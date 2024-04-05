<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);
header('X-Content-Type-Options: nosniff');
require_once '../db_config.php';

// Define an array of allowed origins
$allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://www-student.cse.buffalo.edu'
];

// Get the origin of the current request
$requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if the request origin is in the allowed origins list
if (in_array($requestOrigin, $allowedOrigins)) {
    // If so, set the Access-Control-Allow-Origin header to the request origin
    header("Access-Control-Allow-Origin: $requestOrigin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
} else {
    // Optionally handle requests from disallowed origins, such as logging or sending a specific response
    // For now, we'll simply exit to prevent further execution for disallowed origins
    exit('Origin not allowed');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Stop script execution after sending preflight response
    exit(0);
}

// Get the database connection
function getDbConnection() {
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        return ['error' => 'Connection failed: ' . $conn->connect_error];
    }
    return $conn;
}

// Fetch all rows from the prof_reviews table
function fetchReviews() {
    $conn = getDbConnection();
    if (isset($conn['error'])) {
        return ['error' => $conn['error']];
    }
    
    $sql = "SELECT * FROM prof_reviews";
    $result = $conn->query($sql);
    
    $reviews = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $reviews[] = $row;
        }
    }
    
    $conn->close();
    return $reviews;
}

// Fetch reviews
$reviews = fetchReviews();

// Check if reviews exist
if (!empty($reviews)) {
    // Return reviews as JSON
    echo json_encode($reviews);
} else {
    // No reviews found
    echo json_encode(['message' => 'No reviews found']);
}
?>
