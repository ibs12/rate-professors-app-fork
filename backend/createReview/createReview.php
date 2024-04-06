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

    // Filter and sanitize the inputs
    $userId = filter_var($data['userID'], FILTER_SANITIZE_NUMBER_INT);
    $professorId = filter_var($data['professorID'], FILTER_SANITIZE_NUMBER_INT);
    $difficulty = filter_var($data['difficulty'], FILTER_SANITIZE_NUMBER_INT);
    $helpfulness = filter_var($data['helpfulness'], FILTER_SANITIZE_NUMBER_INT);
    $clarity = filter_var($data['clarity'], FILTER_SANITIZE_NUMBER_INT);
    $feedbackQuality = filter_var($data['Feedback_Quality'], FILTER_SANITIZE_NUMBER_INT);
    $accessibility = filter_var($data['accessibility'], FILTER_SANITIZE_NUMBER_INT);
    $comment = htmlspecialchars($data['comment'], ENT_QUOTES, 'UTF-8');
    $course = htmlspecialchars($data['course'], ENT_QUOTES, 'UTF-8'); // New
    $term = htmlspecialchars($data['term'], ENT_QUOTES, 'UTF-8'); // New

    if (!$userId || !$professorId) {
        http_response_code(400);
        echo json_encode(["error" => "UserID and ProfessorID are required."]);
        exit;
    }

    $conn = getDbConnection();
    $stmt = $conn->prepare("INSERT INTO prof_reviews (userID, professorID, course, term, difficulty, helpfulness, clarity, Feedback_Quality, accessibility, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    // Corrected bind_param line:
    $stmt->bind_param("iissiiiiis", $userId, $professorId, $course, $term, $difficulty, $helpfulness, $clarity, $feedbackQuality, $accessibility, $comment);


    if ($stmt->execute()) {
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
