    // Array Of Logs in Seconds
    $logisArray = [];
    // Current Date
    $curDate = '2018-09-01';
    // Get Logs From DB
    $l = \DB::table('logs')
        ->select('customers_id', \DB::raw('GROUP_CONCAT(log_statuses_id,\' - \',created_at) as activity'))
        ->where(\DB::raw('date(created_at)'), $curDate)
        ->whereIn('log_statuses_id', [7,8])
        ->groupBy('customers_id')
        ->get();
    foreach($l as $log){
      // Get Log Activities From String
      $logsActivitiesArray = explode(',', $log->activity);
      // Start Datetime and End Datetime From 00:00 To 24:00
      $startDayTime = strtotime($curDate.' 00:00:00');
      $endDayTime = strtotime($curDate.' 23:59:59');
      // Initialize Timestamp - Time in Seconds
      $time = 0;
      $duplicateSwitchOffChecker = 0;
      $duplicateSwitchOnChecker = 0;
      foreach ( $logsActivitiesArray as $key => $activity ) {
        // Convert Each Activity Into Array like logstatus_id => datetime
        $singleActivity = explode(' - ', $activity);
        $logActivity[$singleActivity[0]] = $singleActivity[1];
        // Convert singleActivity into Timestamp
        $logTime = strtotime($singleActivity[1]);
        // Check if status is switchOff and SwitchOn
        if($singleActivity[0] == 7 && $duplicateSwitchOffChecker == 0){
          $time = $time + ($logTime - $startDayTime);
          $duplicateSwitchOffChecker = 1;
          $duplicateSwitchOnChecker = 0;
        }else if($singleActivity[0] == 8 && $duplicateSwitchOnChecker == 0){
          // Change StartDayTime
          $startDayTime = $logTime;
          $duplicateSwitchOffChecker = 0;
          $duplicateSwitchOnChecker = 1;
        }
        // If Last Array elements Status is switchOn Than time = time + endTime - logtime
        if(($key == (sizeof($logsActivitiesArray) -1)) && $singleActivity[0] == 8){
          $time = $time + ($endDayTime-$logTime);
        }
      }
      $logisArray[$log->customers_id] = $time;

    }
    echo "<pre>",print_r($logisArray),"</pre>";
