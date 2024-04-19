<?php
require_once '../db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); // Stop script execution after sending preflight response
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$filter = isset($_GET['filter']) ? $_GET['filter'] : null;
$searchQuery = isset($_GET['query']) ? $_GET['query'] : '';
$searchWords = explode(' ', strtolower($searchQuery));
$typoVariations = [];

foreach ($searchWords as $word) {
    $typoVariations[] = $word;
    for ($i = 0; $i < strlen($word); $i++) {
        $variation = substr_replace($word, '_', $i, 1);
        $typoVariations[] = $variation;
    }
}

$likePatterns = array_unique($typoVariations);

if ($filter === 'professors') {
    $sqlPatterns = implode("%' OR professors LIKE '%", $likePatterns);
    $sql = "SELECT professorID, professors, education, department, classes, research, email, office, phone, pfppath, difficulty, helpfulness, clarity, Feedback_Quality, accessibility, (CASE WHEN professors LIKE '%$searchQuery%' THEN 1 ELSE 0 END) AS exactMatch FROM professors WHERE professors LIKE '%$sqlPatterns%'";
} elseif ($filter === 'classes') {
    $sqlPatterns = implode("%' OR classes LIKE '%", $likePatterns);
    $sql = "SELECT professorID, professors, education, department, classes, research, email, office, phone, pfppath, difficulty, helpfulness, clarity, Feedback_Quality, accessibility, (CASE WHEN classes LIKE '%$searchQuery%' THEN 1 ELSE 0 END) AS exactMatch FROM professors WHERE classes LIKE '%$sqlPatterns%'";
} else {
    echo json_encode(['error' => 'Invalid filter']);
    $conn->close();
    exit;
}

$result = $conn->query($sql);
$matches = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['similarityScore'] = similar_text(strtolower($searchQuery), strtolower($row[$filter]));
        $matches[] = $row;
    }
}

usort($matches, function ($a, $b) {
    if ($a['exactMatch'] == $b['exactMatch']) {
        return $b['similarityScore'] <=> $a['similarityScore'];
    }
    return $b['exactMatch'] <=> $a['exactMatch'];
});

header('Content-Type: application/json');
echo json_encode($matches);

$conn->close();
