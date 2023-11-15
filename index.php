<?php
//head for CORS
header('Access-Control-Allow-Origin: *'); // This allows any origin. 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Credentials: true');
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { //set status code if OPTIONS
    http_response_code(200);
    exit;
}

require __DIR__ . "/inc/bootstrap.php";
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);// breakdown uri here
$uri = explode( '/', $uri );
if($uri[2]=='user'){
    require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";
    $objUserController = new UserController();
    $strMethodName = $uri[3] . 'Action';
    $objUserController->{$strMethodName}();

}

?>