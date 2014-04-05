<?php

$subject = $_POST['subject'];
$message = $_POST['message'];

$f = fopen("feedback_zebra.txt", "a");
fwrite($f, $subject."\n");
fwrite($f, $message."\n\n");

fclose($f);

header('location: /index.html');