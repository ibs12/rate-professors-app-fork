<?php
// Set up error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set content type to JSON
header('Content-Type: application/json');

// Include database configuration
require_once '../db_config.php';

// Get input data from frontend
$data = json_decode(file_get_contents('php://input'), true);

// Check if request method is OPTIONS (preflight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Stop script execution after sending preflight response
    exit(0);
}

// Function to establish database connection
function getDbConnection()
{
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        // Error connecting to the database
        http_response_code(500); // Server error
        echo json_encode(["message" => "Failed to connect to the database: " . $conn->connect_error]);
        exit;
    }
    return $conn;
}

// Function to update username based on userID
function updateUsername($userId, $newUsername)
{
    $conn = getDbConnection();

    // Prepare statement to update username
    if ($stmt = $conn->prepare("UPDATE users SET username = ? WHERE userID = ?")) {
        $stmt->bind_param("si", $newUsername, $userId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            // Username updated successfully
            echo json_encode(["status" => "success", "message" => "Username updated successfully."]);
        } else {
            // No rows affected, username not updated
            http_response_code(400); // Bad Request
            echo json_encode(["status" => "error", "message" => "Failed to update username."]);
        }

        $stmt->close();
    } else {
        // Statement preparation failed
        http_response_code(500); // Server error
        echo json_encode(["message" => "Failed to prepare statement: " . $conn->error]);
    }

    $conn->close();
}

// Extract session ID and new username from input data
$sessionId = $data['sessionID'] ?? null;
$newUsername = $data['username'] ?? null;

// Validate input data
if (is_null($sessionId) || is_null($newUsername)) {
    // Session ID or new username not provided
    http_response_code(400); // Bad Request
    echo json_encode(["status" => "error", "message" => "Session ID or new username not provided."]);
    exit;
}

// Check if session ID is valid and get userID
$conn = getDbConnection();

if ($stmt = $conn->prepare("SELECT userID FROM sessions WHERE sessionID = ?")) {
    $stmt->bind_param("s", $sessionId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $userId = $row['userID'];
        $stmt->close();
        updateUsername($userId, $newUsername); // Update username
    } else {
        // Session ID not found or multiple records found
        http_response_code(404); // Not Found
        echo json_encode(["status" => "error", "message" => "Invalid session ID."]);
    }
} else {
    // Statement preparation failed
    http_response_code(500); // Server error
    echo json_encode(["message" => "Failed to prepare statement: " . $conn->error]);
}

$conn->close();
?>
