<?php
//------------This file inserts your field data into the MySQL database
include_once("../../globals.php");
include_once("../../../library/api.inc");
include_once("../../../library/forms.inc");
include_once("../../../library/sql.inc");
include_once("content_parser.php");

$field_names = array('category' => $_POST['category'], 'subcategory' => $_POST['subcategory'], 'item' => $_POST['item'], 'content' => $_POST['content']);
$camos_array = array();
process_commands($field_names['content'],$camos_array); 
//foreach ($field_names as $k => $var) {
//  $field_names[$k] = mysql_real_escape_string($var);
//}

$CAMOS_form_name = "CAMOS-".$field_names['category'].'-'.$field_names['subcategory'].'-'.$field_names['item'];

if ($encounter == "") {
  $encounter = date("Ymd");
}

if (preg_match("/^[\s\\r\\n\\\\r\\\\n]*$/",$field_names['content']) == 0) { //make sure blanks do not get submitted
  $newid = formSubmit("form_CAMOS", $field_names, $_GET["id"], $userauthorized);
  addForm($encounter, $CAMOS_form_name, $newid, "CAMOS", $pid, $userauthorized);
}
//deal with embedded camos submissions here
foreach($camos_array as $val) {
  if (preg_match("/^[\s\\r\\n\\\\r\\\\n]*$/",$val['content']) == 0) { //make sure blanks not submitted
    foreach($val as $k => $v) {
      $val[$k] = trim($v);  
    } 
    $CAMOS_form_name = "CAMOS-".$val['category'].'-'.$val['subcategory'].'-'.$val['item'];
    $newid = formSubmit("form_CAMOS", $val, $_GET["id"], $userauthorized);
    addForm($encounter, $CAMOS_form_name, $newid, "CAMOS", $pid, $userauthorized);
  }
}
echo "<font color=red><b>submitted: " . time() . "</b></font>";
?>
