<?php
require_once '../db_config.php';

// Set content type to JSON
header('Content-Type: application/json');

// Set up error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Prevent MIME sniffing
header('X-Content-Type-Options: nosniff');

// Check if request method is OPTIONS (preflight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Get JSON content from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['sessionID']) || !isset($data['major']) || !isset($data['graduationYear'])) {
    $missingFields = array_filter(['sessionID', 'major', 'graduationYear'], fn ($field) => !isset($data[$field]));
    echo json_encode(["status" => "error", "message" => "The following fields are required: " . implode(', ', $missingFields)]);
    exit;
}

$sessionID = $data['sessionID'];
$major = $data['major'];
$graduationYear = $data['graduationYear'];

// Validate non-empty fields
$emptyFields = array_filter(['sessionID' => $sessionID, 'major' => $major, 'graduationYear' => $graduationYear], fn ($value) => empty($value));
if (!empty($emptyFields)) {
    echo json_encode(["status" => "error", "message" => "The following fields cannot be empty: " . implode(', ', array_keys($emptyFields))]);
    exit;
}


// Function to establish database connection
function getDbConnection()
{
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        http_response_code(500); // Server error
        echo json_encode(["message" => "Failed to connect to the database: " . $conn->connect_error]);
        exit;
    }
    return $conn;
}

// Connect to the database
$conn = getDbConnection();

// Retrieve userID from sessions table based on sessionID
$sql = "SELECT userID FROM sessions WHERE sessionID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $sessionID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $userID = $row['userID'];

    // Fetch current major and graduation year
    $checkUserSql = "SELECT major, graduationYear FROM users WHERE userID = ?";
    $stmt = $conn->prepare($checkUserSql);
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $userResult = $stmt->get_result();
    $userRow = $userResult->fetch_assoc();
    $oldMajor = $userRow['major'];
    $oldGraduationYear = $userRow['graduationYear'];

    // Determine changes
    $majorChanged = $major !== $oldMajor;
    $graduationYearChanged = $graduationYear !== $oldGraduationYear;

    // Update user's major and graduation year if changed
    if ($majorChanged || $graduationYearChanged) {
        $updateUserSql = "UPDATE users SET major = ?, graduationYear = ? WHERE userID = ?";
        $stmt = $conn->prepare($updateUserSql);
        $stmt->bind_param("ssi", $major, $graduationYear, $userID);
        $stmt->execute();

        // Update major in prof_reviews table if major has changed
        if ($majorChanged) {
            $updateProfReviewsSql = "UPDATE prof_reviews SET major = ? WHERE userID = ?";
            $stmt = $conn->prepare($updateProfReviewsSql);
            $stmt->bind_param("si", $major, $userID);
            $stmt->execute();
        }

        // Prepare message about changes
        $changes = [
            "userID" => $userID,
            "major" => $majorChanged ? "Changed from $oldMajor to $major" : "Unchanged",
            "graduationYear" => $graduationYearChanged ? "Changed from $oldGraduationYear to $graduationYear" : "Unchanged"
        ];
        echo json_encode(["status" => "success", "message" => "Update successful.", "changes" => $changes]);
    } else {
        echo json_encode(["status" => "success", "message" => "No updates necessary."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "SessionID not found."]);
}

$stmt->close();
$conn->close();
