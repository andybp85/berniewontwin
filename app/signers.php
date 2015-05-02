<?php
define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
if(!IS_AJAX) {
  header("Location: http://" . $_SERVER['HTTP_HOST']);
  exit();
}

require '../vendor/autoload.php';
Dotenv::load('..');

$config = new \Doctrine\DBAL\Configuration();

$connectionParams = array(
  'dbname'   => $_ENV['BERNIE_DB'],
  'user'     => $_ENV['BERNIE_DB_USER'],
  'password' => $_ENV['BERNIE_DB_PASSWD'],
  'host'     => $_ENV['BERNIE_DB_HOST'],
  'driver'   => 'pdo_mysql',
);
$conn = \Doctrine\DBAL\DriverManager::getConnection($connectionParams, $config);

if( isset($_POST['email']) ) {

} else {
  $sql = "SELECT * FROM bernie_signers";
  $stmt =  $conn->prepare($sql);
  $stmt->execute();
  $results = $stmt->fetchAll();

  echo sizeof($results);
}
