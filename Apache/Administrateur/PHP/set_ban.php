<?php 
require "classes/admin.class.php";
$mail = $_POST['Email'];
Admin::setBan($mail);
echo $mail." a été banni";