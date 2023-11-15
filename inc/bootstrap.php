
<?php
// this code is copied from https://code.tutsplus.com/how-to-build-a-simple-rest-api-in-php--cms-37000t
define("PROJECT_ROOT_PATH", __DIR__ . "/../");
// include main configuration file 
require_once PROJECT_ROOT_PATH . "/inc/config.php";
// include the base controller file 
require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
// include the use model file 
require_once PROJECT_ROOT_PATH . "/Model/UserModel.php";
?>