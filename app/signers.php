<?php
// UNCOMMENT ALL THIS:
/*define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');*/
//if(!IS_AJAX) {
  //header("Location: http://" . $_SERVER['HTTP_HOST']);
  //exit();
/*}*/

// DISABLE BEFORE PRODUCTION!!!!
header("Access-Control-Allow-Origin: *");
// YES THIS ^^^^

require './vendor/autoload.php'; // grab the composer classes
Dotenv::load('..'); // grab the db connection info out of the environment

// set up the database connection; using Doctrine for future-proof-ness
$config = new \Doctrine\DBAL\Configuration();

$connectionParams = array(
  'dbname'   => $_ENV['BERNIE_DB'],
  'user'     => $_ENV['BERNIE_DB_USER'],
  'password' => $_ENV['BERNIE_DB_PASSWD'],
  'host'     => $_ENV['BERNIE_DB_HOST'],
  'driver'   => 'pdo_mysql',
);

$conn = \Doctrine\DBAL\DriverManager::getConnection($connectionParams, $config);

// SQL query to count number of rows
$countSQL = "SELECT COUNT(*) FROM bernie_signers";

// handle POST: add person to database
if( isset($_POST['zipcode']) ) {

  $conn->beginTransaction(); //wrapping in a transaction for future-proof-ness

  try {

    $conn->insert('bernie_signers', array(
      'email'        => (isset($_POST['email']) ? $_POST['email'] : '' ),
      'name'         => (isset($_POST['name']) ? $_POST['name'] : ''),
      'zip'          => $_POST['zipcode'],
      'get_involved' => (isset($_POST['getInvolved']) ? 1 : 0 )),
      array(\PDO::PARAM_STR, \PDO::PARAM_STR, \PDO::PARAM_INT, \PDO::PARAM_BOOL)
    );

  } catch(Exception $e) {

    $conn->rollback(); // if it fails, rollback the changes..
    error_log($e); // log the error and give the ajax call an error message
    echo "We're sorry, there's been an error. Please try again soon!";
    die(); // and then die

  }

  // success: give the ajax call the updated total
  $results = $conn->fetchColumn($countSQL, array(1), 0);
  echo "You're person number " . $results . " to say that Bernie Can Win!";
  die();

// or just display the results
} else {

  $results = $conn->fetchColumn($countSQL, array(1), 0);
  echo $results;

}
