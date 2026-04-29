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
    echo json_encode(['success' => false, 'message' => 'Prosimo počakajte nekaj sekund pred pošiljanjem.']);
    exit;
}
$_SESSION[$rate_key] = time();

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Izpolnite vsa obvezna polja.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Neveljaven e-poštni naslov.']);
    exit;
}

$to = 'kristjan.lukek@gmail.com'; // office@levobit.ro
$email_subject = "Kontakt obrazec: $subject";
$email_body = "Sporočilo s spletne strani Levobit.\n\n"
            . "Ime: $name\n"
            . "E-mail: $email\n"
            . "Telefon: $phone\n\n"
            . "Sporočilo:\n$message\n";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

if (mail($to, $email_subject, $email_body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Sporočilo poslano! Odgovorili vam bomo v najkrajšem času.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Napaka strežnika. Pošljite e-pošto neposredno na office@levobit.ro.']);
}
?>