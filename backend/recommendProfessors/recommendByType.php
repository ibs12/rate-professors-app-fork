<?php

ini_set('display_errors', 0); // Turn off error display, use logging instead
ini_set('log_errors', 1); // Enable error logging
error_reporting(E_ALL);
require_once '../db_config.php'; // Adjust the path as needed

header('Content-Type: application/json');

function getDbConnection()
{
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        http_response_code(500);
        error_log("Connection failed: " . $conn->connect_error);
        echo json_encode(["message" => "Failed to connect to database: " . $conn->connect_error]);
        exit;
    }
    return $conn;
}

function getQuizResult($conn, $userID)
{
    $query = $conn->prepare("SELECT quiz_result FROM users WHERE userID = ?");
    $query->bind_param("i", $userID);
    $query->execute();
    $result = $query->get_result();
    if ($row = $result->fetch_assoc()) {
        return $row['quiz_result'];
    } else {
        return null; // No result found
    }
}

function getProfessorsByType($conn, $professorType)
{
    $query = $conn->prepare("SELECT ProfessorID, professors AS Name, pfppath, professor_type, department FROM professors WHERE professor_type = ?");
    if (!$query) {
        error_log("Prepare failed: " . $conn->error);
        http_response_code(500);
        echo json_encode(["message" => "Failed to prepare query: " . $conn->error]);
        exit;
    }

    $query->bind_param("s", $professorType);
    $query->execute();
    $result = $query->get_result();
    $professors = [];

    while ($row = $result->fetch_assoc()) {
        $professors[] = [
            'ProfessorID' => $row['ProfessorID'],
            'Name' => $row['Name'],
            'PfpPath' => $row['pfppath'],
            'ProfessorType' => $row['professor_type'],
            'Department' => $row['department']
        ];
    }

    return $professors;
}

function updateRecommendations($conn, $userID, $professors)
{
    // Remove existing recommendations for the user
    $deleteQuery = $conn->prepare("DELETE FROM recommended_professors WHERE UserID = ?");
    $deleteQuery->bind_param("i", $userID);
    $deleteQuery->execute();

    // Insert new recommendations
    $insertQuery = $conn->prepare("INSERT INTO recommended_professors (UserID, ProfessorID, prof_match) VALUES (?, ?, ?)");
    foreach ($professors as $professor) {
        $insertQuery->bind_param("iis", $userID, $professor['ProfessorID'], $professor['ProfessorType']);
        $insertQuery->execute();
    }
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['userID'])) {
    $userID = $data['userID'];

    $conn = getDbConnection();
    $quizResult = getQuizResult($conn, $userID);

    if ($quizResult === null) {
        echo json_encode(['message' => 'Quiz result not found for the given user ID.']);
        exit;
    }

    $quizResult = strtoupper($quizResult);
    if (!in_array($quizResult, ['A', 'B', 'C', 'D', 'E'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid quiz result.']);
        exit;
    }

    $professors = getProfessorsByType($conn, $quizResult);
    updateRecommendations($conn, $userID, $professors);
    $conn->close();

    echo json_encode(['message' => 'Recommendations updated successfully.', 'professors' => $professors]);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'User ID is missing.']);
}
