<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
// this code is modified using the template from https://code.tutsplus.com/how-to-build-a-simple-rest-api-in-php--cms-37000t
// for implementation convenience, I combine SongModel and UserModel into one file --- UserModel
class UserModel extends Database
{
    public function getUsers($limit) // model function for getting userlist
    {
        return $this->select("SELECT * FROM users ORDER BY username ASC LIMIT ?", ["i", $limit]);
    }

    public function createUser($username,$password)//model function for registration
    {
        $result = $this->select("SELECT * FROM users WHERE username = ?", ["s", $username]);
        $num = count($result);
        if ($num === 0) {
        $sql =  "INSERT INTO users (username, password) VALUES (?,?)";
        $stmt = $this->connection->prepare($sql);
        $pass = password_hash($password, PASSWORD_DEFAULT); // Hashing the password
        $stmt->bind_param("ss", $username, $pass);
        $stmt->execute();
        return true;
        }
        else{
            return false;
        }
    }

    public function checkUser($username, $password)// model function for login 
    {
        $result = $this->select("SELECT * FROM users where username=?", ["s", $username]);
        $num = count($result);
        $hashed_password = $result[0]['password'];
        if ($num > 0 && password_verify($password, $hashed_password)) {
            echo "true";
        } else {
            echo "false";
        }
    }

    public function updateRating($id, $artist, $song, $rating)// model function for update ratings
    {
        $sql = "UPDATE ratings SET artist = ?, song = ?, rating = ? WHERE id = ?";
        $stmt = $this->connection->prepare($sql);
        $stmt->bind_param("ssii", $artist, $song, $rating, $id);
        $stmt->execute();
    }

    public function deleteRating($id)// model function for delete a rating
    {
        $sql = "DELETE FROM ratings WHERE id = ?";
        $stmt = $this->connection->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
    }

    public function addRating($username, $artist, $song, $rating)// model function for adding a new song
    {
        $result = $this->select("SELECT * FROM ratings WHERE song = ?", ["s", $song]);
        $num = count($result);
        if ($num === 0) {
            $sql = "INSERT INTO ratings (username, artist, song, rating) VALUES (?,?,?,?)";
            $stmt = $this->connection->prepare($sql);
            $stmt->bind_param("sssi", $username, $artist, $song, $rating);
            $stmt->execute();
            $result2 = $this->select("SELECT * FROM ratings ORDER BY id ASC LIMIT ?", ["i", 30]);
            return $result2;
        }
        else{
            return "false";

        }
    }

    public function getRating($limit)//model function for getting song list
    {
        return $this->select("SELECT * FROM ratings ORDER BY id ASC LIMIT ?", ["i", $limit]);
    }
}
?>
