<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
if($_SERVER["REQUEST_METHOD"] == "POST") {
    $admin_email = "senteujoshua@gmail.com";
    $name = filter_var(&_POST["name"], FILTER_SANITIZEZ_STRING);
    $email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);
    $phone = filter_var($_POST["phone"], FILTER_SANITIZE_STRING);
    $services = filter_var($_POST["services"], FILTER_SANITIZE_STRING);
    $date = filter_var($_POST["date"], FILTER_SANITIZE_STRING);

    if(!$email) {
        echo "<script>alert('Invalid email format!'); window.history.back();</script>";
        exit;
    }
    
    $mail = new PHPMailer(true);
    try{
        $mail-> isSMTP();
        $mail->HOST = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = "senteujoshua@gmail.com";
        $mail->Password = "0928280SenteuJoshua";
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setForm('senteujoshua@gmail.com','Joshua Senteu');
        $mail->addAddress($admin_email);
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = "New Appointment Request from $name";
        $mail->Body    = "
            <h3>New Appointment Request</h3>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Services:</strong> $services</p>
            <p><strong>Preferred Date:</strong> $date</p>
        ";


        $mail->send();
        echo "<script>alert('Appointment request sent successfully!'); window.location.href='index.html';</script>";
    } catch (Exception $e) {
        error_log("Mail error: " . $mail->ErrorInfo);
        echo "<script>alert('Failed to send appointment request. Please try again later.'); window.history.back();</script>";
    }
} else {
    echo "<script>alert('Invalid Request!'); window.history.back();</script>";
}
?>

