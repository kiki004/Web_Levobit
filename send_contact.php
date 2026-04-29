<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

// Honeypot
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true, 'message' => 'Message received.']);
    exit;
}

// Rate limiting (3 seconds)
$ip = $_SERVER['REMOTE_ADDR'];
$rate_key = 'last_contact_' . $ip;
if (isset($_SESSION[$rate_key]) && (time() - $_SESSION[$rate_key] < 3)) {
    echo json_encode(['success' => false, 'message' => 'Please wait a few seconds before sending another message.']);
    exit;
}
$_SESSION[$rate_key] = time();

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

$to = 'kristjan.lukek@gmail.com'; // Replace with office@levobit.ro for production
$email_subject = "Contact form: $subject";
$email_body = "Message from Levobit website.\n\n"
            . "Name: $name\n"
            . "Email: $email\n"
            . "Phone: $phone\n\n"
            . "Message:\n$message\n";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

if (mail($to, $email_subject, $email_body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent! We will get back to you as soon as possible.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Server error. Please send an email directly to office@levobit.ro.']);
}
?>