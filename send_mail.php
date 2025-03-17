<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $admin_email = "senteujoshua@gmail.com"; 
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $phone = htmlspecialchars($_POST["phone"]);
    $services = htmlspecialchars($_POST["services"]);
    $date = htmlspecialchars($_POST["date"]);

    $subject = "New Appointment Request from $name";
    $message = "
        <h3>New Appointment Request</h3>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Services:</strong> $services</p>
        <p><strong>Preferred Date:</strong> $date</p>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $email" . "\r\n";
    
    if (mail($admin_email, $subject, $message, $headers)) {
        echo "<script>alert('Appointment request sent successfully!'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Failed to send appointment request. Please try again.'); window.history.back();</script>";
    }
} else {
    echo "<script>alert('Invalid Request!'); window.history.back();</script>";
}
?>
