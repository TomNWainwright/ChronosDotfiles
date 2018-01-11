moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);

function save_min(){
  var value = document.getElementById('min').value;
  chrome.storage.sync.set({'min': value}, function() {});
}

function sync_next() {
  chrome.alarms.get('standup', function (alarm) {
    document.getElementById('next').innerHTML = countdown(new Date(alarm.scheduledTime)).toString();
    document.getElementById('time').innerHTML = moment(alarm.scheduledTime).format('h:mm:ss a');
  });
}

function init(){
  chrome.storage.sync.get(
    {
      'min': 60
    },
    function(items) {
      document.getElementById('min').value = items.min;
    }
  );
  sync_next();
  setInterval(sync_next, 1000);
}

function reset() {
  chrome.extension.getBackgroundPage().setupAlarm();
}

document.addEventListener('DOMContentLoaded', init);
document.getElementById('min').addEventListener('change', save_min);
document.getElementById('reset').addEventListener('click', reset);