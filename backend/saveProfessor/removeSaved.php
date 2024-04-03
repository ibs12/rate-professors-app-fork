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
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

$conn = getDbConnection();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);

    $sessionID = $data['sessionID'] ?? null;
    $professorID = $data['professorID'] ?? null;

    if (!$sessionID) {
        exit(json_encode(['error' => 'Session ID is missing.']));
    }

    // Query the `sessions` table to get the userID associated with the sessionID
    $stmt = $conn->prepare("SELECT userID FROM `sessions` WHERE sessionID = ?");
    $stmt->bind_param("s", $sessionID);
    $stmt->execute();
    $stmt->bind_result($userID);
    $stmt->fetch();
    $stmt->close();

    if (!$userID) {
        exit(json_encode(['error' => 'User not authenticated.']));
    }

    if (!$professorID) {
        exit(json_encode(['error' => 'Professor ID is missing.']));
    }

    // Remove the specified professorID and userID from the database
    $stmt = $conn->prepare("DELETE FROM saved_professors WHERE userID = ? AND professorID = ?");
    $stmt->bind_param("ii", $userID, $professorID);
    if ($stmt->execute()) {
        $response = [
            'message' => 'Professor removed successfully.'
        ];
        exit(json_encode($response));
    } else {
        exit(json_encode(['error' => 'Error removing professor.']));
    }
}

$conn->close();
