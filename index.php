<?php
$test['name'] = "John";
$test['phone'] = "987987987";
$test['address'] = "Asheville";

foreach($test as $key=>$val){
  $$key = $test[$key];
}
echo $phone;
?>
