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
    // Stop script execution after sending preflight response
    exit(0);
}

// Get JSON content from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Check if sessionID, major, and graduationYear are provided in the request body
if (!isset($data['sessionID']) || !isset($data['major']) || !isset($data['graduationYear'])) {
    $missingFields = [];
    if (!isset($data['sessionID'])) {
        $missingFields[] = "sessionID";
    }
    if (!isset($data['major'])) {
        $missingFields[] = "major";
    }
    if (!isset($data['graduationYear'])) {
        $missingFields[] = "graduationYear";
    }
    echo json_encode(["status" => "error", "message" => "The following fields are required: " . implode(', ', $missingFields)]);
    exit;
}

$sessionID = $data['sessionID'];
$major = $data['major'];
$graduationYear = $data['graduationYear'];

// Check if any of the input parameters are empty
if (empty($sessionID) || empty($major) || empty($graduationYear)) {
    $emptyFields = [];
    if (empty($sessionID)) {
        $emptyFields[] = "sessionID";
    }
    if (empty($major)) {
        $emptyFields[] = "major";
    }
    if (empty($graduationYear)) {
        $emptyFields[] = "graduationYear";
    }
    echo json_encode(["status" => "error", "message" => "The following fields cannot be empty: " . implode(', ', $emptyFields)]);
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

    // Check if user already has a major and graduation date
    $checkUserSql = "SELECT major, graduationYear FROM users WHERE userID = ?";
    $stmt = $conn->prepare($checkUserSql);
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $userResult = $stmt->get_result();
    $userRow = $userResult->fetch_assoc();
    $oldMajor = $userRow['major'];
    $oldGraduationYear = $userRow['graduationYear'];

    // Check if new major and old major are the same
    if ($major === $oldMajor) {
        $majorChanged = false;
    } else {
        $majorChanged = true;
    }

    // Check if new graduation year and old graduation year are the same
    if ($graduationYear === $oldGraduationYear) {
        $graduationYearChanged = false;
    } else {
        $graduationYearChanged = true;
    }

    // Update user's major and graduation year if they have changed
    if ($majorChanged || $graduationYearChanged) {
        // Update user's major and graduation year
        $updateSql = "UPDATE users SET major = ?, graduationYear = ? WHERE userID = ?";
        $stmt = $conn->prepare($updateSql);
        $stmt->bind_param("ssi", $major, $graduationYear, $userID);
        if ($stmt->execute()) {
            // Prepare the message indicating what has been changed
            $message = "User's ID: $userID\n";
            if ($majorChanged) {
                $message .= "Old major: $oldMajor, New major: $major\n";
            } else {
                $message .= "Major: $major is the same as the old one\n";
            }
            if ($graduationYearChanged) {
                $message .= "Old graduation date: $oldGraduationYear, New graduation date: $graduationYear\n";
            } else {
                $message .= "Graduation date: $graduationYear is the same as the old one\n";
            }
            echo json_encode(["status" => "success", "message" => "User's major and graduation year updated successfully.", "changes" => $message]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update user's major and graduation year."]);
        }
    } else {
        echo json_encode(["status" => "success", "message" => "User's major and graduation year are the same as the old ones.", "changes" => ""]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "SessionID not found."]);
}

$stmt->close();
$conn->close();
?>
