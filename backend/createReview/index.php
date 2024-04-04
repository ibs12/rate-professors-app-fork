<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Review</title>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            document.querySelector("form").addEventListener("submit", function(e) {
                e.preventDefault(); // Prevent the default form submission

                const formData = {
                    userID: document.getElementById('userID').value,
                    professorID: document.getElementById('professorID').value,
                    difficulty: document.getElementById('difficulty').value,
                    helpfulness: document.getElementById('helpfulness').value,
                    clarity: document.getElementById('clarity').value,
                    Feedback_Quality: document.getElementById('Feedback_Quality').value,
                    accessibility: document.getElementById('accessibility').value,
                    comment: document.getElementById('comment').value,
                    course: document.getElementById('course').value, // New
                    term: document.getElementById('term').value, // New
                };

                fetch('createReview.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        alert("Review submitted successfully.");
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert("An error occurred while submitting the review.");
                    });
            });
        });
    </script>
</head>

<body>
    <h2>Add a Professor Review</h2>
    <form>
        <label for="userID">User ID:</label><br>
        <input type="number" id="userID" name="userID" required><br>
        <label for="professorID">Professor ID:</label><br>
        <input type="number" id="professorID" name="professorID" required><br>
        <label for="course">Course:</label><br>
        <input type="text" id="course" name="course" required><br>
        <label for="term">Term:</label><br>
        <input type="text" id="term" name="term" required><br>
        <label for="difficulty">Difficulty (1-5):</label><br>
        <input type="number" id="difficulty" name="difficulty" min="1" max="5" required><br>
        <label for="helpfulness">Helpfulness (1-5):</label><br>
        <input type="number" id="helpfulness" name="helpfulness" min="1" max="5" required><br>
        <label for="clarity">Clarity (1-5):</label><br>
        <input type="number" id="clarity" name="clarity" min="1" max="5" required><br>
        <label for="Feedback_Quality">Feedback Quality (1-5):</label><br>
        <input type="number" id="Feedback_Quality" name="Feedback_Quality" min="1" max="5" required><br>
        <label for="accessibility">Accessibility (1-5):</label><br>
        <input type="number" id="accessibility" name="accessibility" min="1" max="5" required><br>
        <label for="comment">Comment:</label><br>
        <textarea id="comment" name="comment" rows="4" required></textarea><br>


        <input type="submit" value="Submit Review">
    </form>
</body>

</html>