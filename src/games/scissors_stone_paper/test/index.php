
<html>
<head>
  <title>Scissors Stone Paper</title>
</head>

<body>
  <?php
  function scandir1($dir){
      return array_values(array_diff(scandir($dir), array('..', '.')));
  }
  
  function filter($e){
      $pos = strpos($e,"128x128");
      
      if(!$pos)return false;
      
      return true;
  }
  
  $allfiles  = scandir1("../../../images/profiles/resize/");
  $files = array_values(array_filter($allfiles, "filter"));
  
  $p1= $files[random_int(0,sizeof($files)-1)];
  $p2= $files[random_int(0,sizeof($files)-1)];
  ?>

  <img src="../../../images/profiles/resize/<?=$p1?>" id="p2" alt="" hidden>
  <img src="../../../images/profiles/resize/<?=$p2?>" id="p1" alt="" hidden>
  <img src="img/stone.png" id="stone" alt="" hidden>
  <img src="img/paper.png" id="paper" alt="" hidden>
  <img src="img/scissors.png" id="scissors" alt="" hidden>
  <img src="img/wtf.png" id="wtf" alt="" hidden>
  <img src="img/bang.png" id="bang" alt="" hidden>
  
  <canvas id="scissors_stone_paper"></canvas>
  <script type="text/javascript" src="ScissorsStonePaper.js"></script>
</body>
</html>