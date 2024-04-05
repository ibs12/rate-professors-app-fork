<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);
header('X-Content-Type-Options: nosniff');
require_once '../db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Stop script execution after sending preflight response
    exit(0);
}

// Get the database connection
function getDbConnection() {
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception('Connection failed: ' . $conn->connect_error);
    }
    return $conn;
}

// Fetch all rows from the prof_reviews table
// Fetch all rows from the prof_reviews table
function fetchReviews() {
    try {
        $conn = getDbConnection();
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
    } catch (Exception $e) {
        http_response_code(500);
        return ['error' => $e->getMessage()];
    }
}

$reviews = fetchReviews();

if (!empty($reviews)) {
    http_response_code(200);
    echo json_encode($reviews); // Convert reviews array to JSON and echo it
} else {
    http_response_code(404);
    echo json_encode(['error' => 'No reviews found']); // Echo JSON error message
}
?>