<?php
// Include database configuration
include 'db_config.php';

// Connect to your MySQL database
$mysqli = new mysqli($db_host, $db_username, $db_password, $db_name);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Retrieve sessionID from the frontend (you need to implement this part)
$sessionID = $_POST['sessionID']; // Assuming sessionID is sent via POST

// Query the 'sessions' table to get the userID associated with the sessionID
$stmt = $mysqli->prepare("SELECT userID FROM sessions WHERE sessionID = ?");
$stmt->bind_param("s", $sessionID);
$stmt->execute();
$stmt->bind_result($userID);
$stmt->fetch();
$stmt->close();

if ($userID) {
    // Update the 'users' table with quiz results
    $stmt = $mysqli->prepare("UPDATE users SET quiz_result = ? WHERE userID = ?");
    $stmt->bind_param("si", $_POST['quizResult'], $userID); // Assuming quizResult is sent via POST
    $stmt->execute();
    $stmt->close();
} else {
    echo "User not found";
}

// Close the database connection
$mysqli->close();

?>
