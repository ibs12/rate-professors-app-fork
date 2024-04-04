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
function getDbConnection()
{
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to connect to database: " . $conn->connect_error]);
        exit;
    }
    return $conn;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    if (is_null($data)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON format"]);
        exit;
    }

    // Assuming all keys exist in the $data array and are of the expected type
    $userId = filter_var($data['userID'], FILTER_SANITIZE_NUMBER_INT);
    $professorId = filter_var($data['professorID'], FILTER_SANITIZE_NUMBER_INT);
    $difficulty = filter_var($data['difficulty'], FILTER_SANITIZE_NUMBER_INT);
    $helpfulness = filter_var($data['helpfulness'], FILTER_SANITIZE_NUMBER_INT);
    $clarity = filter_var($data['clarity'], FILTER_SANITIZE_NUMBER_INT);
    $feedbackQuality = filter_var($data['Feedback_Quality'], FILTER_SANITIZE_NUMBER_INT);
    $accessibility = filter_var($data['accessibility'], FILTER_SANITIZE_NUMBER_INT);
    $comment = htmlspecialchars($data['comment'], ENT_QUOTES, 'UTF-8');

    if (!$userId || !$professorId) {
        http_response_code(400);
        echo json_encode(["error" => "UserID and ProfessorID are required."]);
        exit;
    }

    $conn = getDbConnection();
    $stmt = $conn->prepare("INSERT INTO prof_reviews (userID, professorID, difficulty, helpfulness, clarity, Feedback_Quality, accessibility, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiiiiis", $userId, $professorId, $difficulty, $helpfulness, $clarity, $feedbackQuality, $accessibility, $comment);

    if ($stmt->execute()) {
        // Optionally, fetch last inserted ID or any other relevant data
        // $lastId = $conn->insert_id;
        echo json_encode(["message" => "New review added successfully.", "status" => "success"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error inserting review: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
