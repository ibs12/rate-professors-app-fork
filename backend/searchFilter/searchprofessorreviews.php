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
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

// Check if the professorID is provided in the request
if (isset($_POST['professorID'])) {
    // Sanitize the input to prevent SQL injection
    $professorID = $_POST['professorID'];
    $professorID = mysqli_real_escape_string(getDbConnection(), $professorID);

    // Prepare the SQL query to fetch reviews for the specified professorID
    $query = "SELECT * FROM prof_reviews WHERE professorID = '$professorID'";

    // Execute the query
    $result = mysqli_query(getDbConnection(), $query);

    if ($result) {
        // Fetch data and store in array
        $reviews = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $reviews[] = $row;
        }

        // Return reviews as JSON response
        echo json_encode(array(
            'success' => true,
            'reviews' => $reviews
        ));
    } else {
        // If query execution fails
        echo json_encode(array(
            'success' => false,
            'error' => 'Failed to execute query'
        ));
    }
} else {
    // If professorID is not provided in the request
    echo json_encode(array(
        'success' => false,
        'error' => 'Professor ID is required'
    ));
}

// Close database connection (optional)
getDbConnection()->close();

?>
