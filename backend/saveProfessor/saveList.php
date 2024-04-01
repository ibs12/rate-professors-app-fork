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

// Function to fetch saved professors
function getSavedProfessors($userID, $conn)
{
    $stmt = $conn->prepare("
        SELECT p.professorID, p.professors
        FROM saved_professors sp
        JOIN professors p ON sp.professorID = p.professorID
        WHERE sp.userID = ?
    ");
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_all(MYSQLI_ASSOC);  // Fetches the results as an associative array
}

$conn = getDbConnection();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userID = $_POST['userID'] ?? null;
    $professorID = $_POST['professorID'] ?? null;
    $action = $_POST['action'] ?? '';

    if ($userID === null || $professorID === null) {
        exit(json_encode(['error' => 'UserID and ProfessorID are required.']));
    }

    if ($action === 'save') {
        $stmt = $conn->prepare("INSERT INTO saved_professors (userID, professorID) VALUES (?, ?) ON DUPLICATE KEY UPDATE professorID = professorID");
        $stmt->bind_param("ii", $userID, $professorID);
    } elseif ($action === 'remove') {
        $stmt = $conn->prepare("DELETE FROM saved_professors WHERE userID = ? AND professorID = ?");
        $stmt->bind_param("ii", $userID, $professorID);
    } else {
        exit(json_encode(['error' => 'Invalid action.']));
    }

    if ($stmt->execute()) {
        $response = [
            'message' => 'Action completed successfully.',
            'saved_professors' => getSavedProfessors($userID, $conn)  // Fetch and return the updated list of saved professors
        ];
        exit(json_encode($response));
    } else {
        exit(json_encode(['error' => $conn->error]));
    }
}

$conn->close();
