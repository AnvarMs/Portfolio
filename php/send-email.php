<?php
// Replace this with your own email address
$to = 'anvarms2005@gmail.com';

function url() {
    return sprintf(
        "%s://%s",
        isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
        $_SERVER['SERVER_NAME']
    );
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim(stripslashes($_POST['name']));
    $email = trim(stripslashes($_POST['email']));
    $subject = trim(stripslashes($_POST['subject']));
    $contact_message = trim(stripslashes($_POST['message']));

    if ($subject == '') {
        $subject = "Contact Form Submission";
    }

    // Set Message
    $message = "Email from: " . $name . "\n";
    $message .= "Email address: " . $email . "\n";
    $message .= "Subject: " . $subject . "\n";
    $message .= "Message: \n" . $contact_message . "\n";
    $message .= "This email was sent from your site " . url() . " contact form.\n";

    // Set From: header
    $from = $name . " <" . $email . ">";

    // Email Headers
    $headers = "From: " . $from . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $mail = mail($to, $subject, $message, $headers);

    $mail = mail($to, $subject, $message, $headers);

if ($mail) {
    echo "OK";
} else {
    echo "Something went wrong. Please try again.";
    // Add error details for debugging
    $lastError = error_get_last();
    print_r($lastError);
}
}

?>
