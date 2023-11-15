<?php
class UserController extends BaseController
{
    /** 
* "/user/list" Endpoint - Get list of users 
*/

// The file is modified based on the template from https://code.tutsplus.com/how-to-build-a-simple-rest-api-in-php--cms-37000t
// for implementation convenience, I combine UserController and SongController into one file: Usercontroller

    public function createAction()// controller for registration
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        if (strtoupper($requestMethod) == 'POST'){
            try {
                $postData = json_decode(file_get_contents('php://input'),true);
                $username = $postData['username'];
                $password = $postData['password'];
                $userModel = new UserModel();
                $responseData = $userModel->createUser($username,$password);
                if ($responseData) {
                    // Send success response along with the song details
                    $this->sendOutput(json_encode($responseData));
                }
            } catch(Error $e){
                $strErrorDesc =$e->getMessage().' Something went wrong!';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        }else{
            $strErrorDesc = "Method not supported";
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
        if(!$strErrorDesc){
            $this ->sendOutput(
                $responseData,
                ['Content-Type: application/json', 'HTTP/1.1 201 Created']
            );
        }
        else{
            $this ->sendOutput(
                json_encode(['error'=>$strErrorDesc]),
                ['Content-Type: application/json',$strErrorHeader]
            );
        }
    }

    public function checkAction(){ // controller function for login
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        if (strtoupper($requestMethod) == 'POST'){
            $postData = json_decode(file_get_contents('php://input'),true);
            $username = $postData['username'];
            $password = $postData['password'];
            // Instantiate a UserModel to check login
            $userModel =  new UserModel();
            $userModel -> checkUser($username,$password);
        } 

    }

    public function deleteAction(){ //controller function for delete
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        if (strtoupper($requestMethod) == 'POST'){
            try {
                $postData = json_decode(file_get_contents('php://input'),true);
                $userModel = new UserModel();
                $id = $postData['id'];
                $userModel-> deleteRating($id);
                $responseData = json_encode(['message'=> 'User created successfully']);
            } catch(Error $e){
                $strErrorDesc =$e->getMessage().' Something went wrong!';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        }else{
            $strErrorDesc = "Method not supported";
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
        if(!$strErrorDesc){
            $this ->sendOutput(
                $responseData,
                ['Content-Type: application/json', 'HTTP/1.1 201 Created']
            );
        }
        else{
            $this ->sendOutput(
                json_encode(['error'=>$strErrorDesc]),
                ['Content-Type: application/json',$strErrorHeader]
            );
        }
    }
    public function updateAction(){ // controller function for update
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        if (strtoupper($requestMethod) == 'POST'){
            $postData = json_decode(file_get_contents('php://input'),true);
            $id = $postData['id'];
            $song = $postData['song'];
            $rating = $postData['rating'];
            $artist = $postData['artist'];
            // Instantiate a UserModel to update a rating
            $userModel =  new UserModel();
            $userModel -> updateRating($artist,$song,$rating,$id);
        }
    }
    public function addAction(){ // controller function for adding a new song
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        if (strtoupper($requestMethod) == 'POST'){
            try {
                $postData = json_decode(file_get_contents('php://input'), true);
                
                // Check for JSON decoding errors
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception('Invalid JSON provided.');
                }
                if (empty($postData)) {
                    throw new Exception('Empty data provided.');
                }
                
                // Check if the required data is available in the POST data
                if (!isset($postData["username"])) {
                    throw new Exception('Incomplete username provided.');
                }
                if (!isset( $postData["artist"])) {
                    throw new Exception('Incomplete artist provided.');
                }
                if (!isset($postData["song"])) {
                    throw new Exception('Incomplete song provided.');
                }
                if (!isset( $postData["rating"])) {
                    throw new Exception('Incomplete rating provided.');
                }
    
                $username = $postData["username"];
                $artist = $postData["artist"];
                $song = $postData["song"];
                $rating = $postData["rating"];
                
                // Check if the required data is null
                if (is_null($username) || is_null($artist) || is_null($song) || is_null($rating)) {
                    throw new Exception('One or more required fields are null.');
                }
    
                // Instantiate a UserModel to create a new rating

                $userModel = new UserModel();
                $newSongDetails = $userModel->addRating($username, $artist, $song, $rating);
            
            if ($newSongDetails) {
                // Send success response along with the song details
                $this->sendOutput(json_encode($newSongDetails));
            }
                
                // Send success response (you can modify this part to your needs)
                
    
            } catch (Exception $e) {
                // Send error response
                $this->sendOutput(json_encode(['error' => $e->getMessage()]), [
                    'Content-Type: application/json',
                    'HTTP/1.1 400 Bad Request'
                ]);
            }
        }
    }
    public function viewAction(){ // controller function for getting rating table
         $strErrorDesc = '';
         $requestMethod = $_SERVER["REQUEST_METHOD"];
         $arrQueryStringParams = $this->getQueryStringParams();
         if (strtoupper($requestMethod) == 'GET') {
             try {
                 $userModel = new UserModel();
                 $intLimit = 20;
                 if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                     $intLimit = $arrQueryStringParams['limit'];
                 }
                 $arrUsers = $userModel->getRating($intLimit);
                 $responseData = json_encode($arrUsers);
             } catch (Error $e) {
                 $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                 $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
             }
         } else {
             $strErrorDesc = 'Method not supported';
             $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
         }
         // send output 
         if (!$strErrorDesc) {
             $this->sendOutput(
                 $responseData,
                 array('Content-Type: application/json', 'HTTP/1.1 200 OK')
             );
         } else {
             $this->sendOutput(json_encode(array('error' => $strErrorDesc)), 
                 array('Content-Type: application/json', $strErrorHeader)
             );
         }
     }
    public function listAction(){ // controller function for getting user list
        $strErrorDesc = '';
         $requestMethod = $_SERVER["REQUEST_METHOD"];
         $arrQueryStringParams = $this->getQueryStringParams();
         if (strtoupper($requestMethod) == 'GET') {
             try {
                 $userModel = new UserModel();
                 $intLimit = 20;
                 if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                     $intLimit = $arrQueryStringParams['limit'];
                 }
                 $arrUsers = $userModel->getUsers($intLimit);
                 $responseData = json_encode($arrUsers);
             } catch (Error $e) {
                 $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                 $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
             }
         } else {
             $strErrorDesc = 'Method not supported';
             $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
         }
         // send output 
         if (!$strErrorDesc) {
             $this->sendOutput(
                 $responseData,
                 array('Content-Type: application/json', 'HTTP/1.1 200 OK')
             );
         } else {
             $this->sendOutput(json_encode(array('error' => $strErrorDesc)), 
                 array('Content-Type: application/json', $strErrorHeader)
             );
         }
     }

}
   


?>