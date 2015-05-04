<?php
/*define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');*/
//if(!IS_AJAX) {
  //header("Location: http://" . $_SERVER['HTTP_HOST']);
  //exit();
/*}*/

// DISABLE BEFORE PRODUCTION!!!!
header("Access-Control-Allow-Origin: *");
// YES THIS ^^^^

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
  $sql = "INSERT INTO `bernie_db`.`bernie_signers` (`email`, `name`, `zip`, `get_involved`) VALUES ('?', '?', '?', '?')";
  $stmt = $conn->prepare($sql);
  $stmt->bindValue(1, $_POST['email']);
  $stmt->bindValue(2, $_POST['name']);
  $stmt->bindValue(3, $_POST['zipcode']);
  $stmt->bindValue(4, $_POST['getInvolved']);
  $stmt->execute();
} else {
  $results = $conn->fetchColumn("SELECT COUNT(*) FROM bernie_signers", array(1), 0);
  echo $results;
}
