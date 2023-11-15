<?php
// this code is copied from https://code.tutsplus.com/how-to-build-a-simple-rest-api-in-php--cms-37000t
class Database
{
    protected $connection = null;
    public function __construct() //construct function
    {
        try {
            $this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME,DB_PORT);
    	
            if ( mysqli_connect_errno()) {
                throw new Exception("Could not connect to database.");   
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());   
        }			
    }
    public function select($query = "" , $params = []) // select based on query
    {
        try {
            $stmt = $this->executeStatement( $query , $params );
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);				
            $stmt->close();
            return $result;
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
        return false;
    }
    private function executeStatement($query = "", $params = [])// execute query
{
    try {
        $stmt = $this->connection->prepare($query);
        if($stmt === false) {
            throw new Exception("Unable to do prepared statement: " . $query);
        }

        if ($params) {
            $types = $params[0];
            $bindValues = array_slice($params, 1);
            $bindParams = [];
            $bindParams[] = &$types;
            foreach ($bindValues as $key => $value) {
                $bindParams[] = &$bindValues[$key];
            }
            call_user_func_array([$stmt, 'bind_param'], $bindParams);
        }

        $stmt->execute();
        return $stmt;
    } catch(Exception $e) {
        throw new Exception($e->getMessage());
    }   
}

}
?>