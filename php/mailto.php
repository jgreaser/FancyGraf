<?php

$to = 'thaines@flvs.net';

//$to = $_GET["receiver"];
$headers = 'From: FancyGraf' . "\r\n";

$headers .= 'Cc: jgreaser@flvs.net' . "\r\n";


$subject = "FancyGraf Subscriber";
$message = $_GET["first"]." "."\n".$_GET["last"]."\n\n".$_GET["email"];


mail($to, $subject, $message, $headers);
?>

