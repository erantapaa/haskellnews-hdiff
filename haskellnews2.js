/*******************************************************************************
 * Model operations
 */

function add_hdiff(n, oldhtml) {
  var href = this.href
  $(this).attr("seen", 1)
  var m = href.match("haskell.org.package/(.*?)-([0-9][^/]*)$")
  if (m) {
    // var hdiffurl = "http://hdiff.luite.com/cgit/" + m[1] + "/diff/"
    var url = "http://hdiff.luite.com/cgit/" + m[1] + "/diff/?tag=" + m[2]
    return ' <a href="' + url + '" target="_blank">(hdiff)</a> '
    // maybe use Δ ?
  } else {
    return ""
  }
}

function toggle_twitter(show) {
  $("table.table a[href^='https://twitter.com/']").parent().parent().toggle(show)
}

function toggle_reddit(show) {
  $("table.table a[href^='https://www.reddit.com/']").parent().parent().toggle(show)
}

function toggle_haskell_cafe(show) {
  $("table.table a[href^='https://groups.google.com/']").parent().parent().toggle(show)
}

function add_hdiff_links() {
  $("table.table a[seen!=1][href^='https://hackage.haskell.org/package/']")
     .after(add_hdiff)
}

function reloadItems() {
  var success = function(data) {
    $("table.table tr").remove()
    $("table.table").html(data)
    add_hdiff_links()
  }
  $.get("http://haskellnews.org/after/1", "", success, "html")
}

function getNewItems(){
  $('tr').first().each(function(){
    var epoch = $(this).attr('id').replace(/[^0-9]/g,'');
    $.get('http://haskellnews.org/after/' + epoch,function(html){
      if(html) {
        $('table').prepend(html);
        add_hdiff_links()
      }
    });
  });
}

function refreshDates(){
  $('.relative-time').each(function(){
    var t = (new Date($(this).attr('data-epoch') * 1000));
    var now = new Date();
    $(this).text(t.relative(now,true));
  });
}

/*******************************************************************************
 *  Date utilities
 */

Date.prototype.relative = function(t2,fix){
  var t1 = this;
  var diff = t1 - t2;
  var minute = 60, hour = minute * 60, day = hour * 24,
  week = day * 7, month = day * 30, year = month * 12;
  return inRange(
    [0,'just now'],
    [5,'% seconds',1],
    [minute,'a minute'],
    [minute*2,'% minutes',minute],
    [minute*30,'half an hour'],
    [minute*31,'% minutes',minute],
    [hour,'an hour'],
    [hour*2,'% hours',hour],
    [hour*3,'a few hours'],
    [hour*4,'% hours',hour],
    [day,'a day'],
    [day*2,'% days',day],
    [week,'a week'],
    [week*2,'% weeks',week],
    [month,'a month'],
    [month*2,'% months',month],
    [year,'a year'],
    [year*2,'% years',year]
  );
  function inRange() {
    var span = Math.abs(diff/1000);
    for (var i = arguments.length-1; i >= 0; i--) {
      var range = arguments[i];
      if (span >= range[0]) {
        return (
          (fix&& diff>0?'in ':'') +
            (range[1].match(/%/)?
             range[1].replace(/%/g,Math.round(span/(range[2]? range[2] : 1)))
             : range[1]) +
            (fix&& diff<0?' ago':'')
        );
      }
    }
  }
};

/*******************************************************************************
 * Main entry point
 */

var urlPrefixes = { 'twitter': "https://twitter.com/",
                    'reddit': "http://www.reddit.com",
                    'hackage': 'https://hackage.haskell.org/package/',
                    'stackoverflow': 'http://stackoverflow.com/',
                    'haskellcafe': 'https://groups.google.com/',
                    'lpaste': 'http://lpaste.net/'
                  }
var sourceState = {  }

function toggleButton(src, show) {
  var sel = "#show_" + src
  if (show) {
    $(sel).parent().addClass('active')
  } else {
    $(sel).parent().removeClass('active')
  }
}

function handleToggle(src) {
  console.log("src:", src)
  sourceState[src] = !sourceState[src]
  var show = sourceState[src]
  var prefix = urlPrefixes[src]
  $("table.table a[href^='" + prefix + "']").parent().parent().toggle(show)
  toggleButton(src, show)
}

$(document).ready(function(){
  var create_handle = function(src) { return function() { handleToggle(src) } }

  for (var src in urlPrefixes) {
    if (urlPrefixes.hasOwnProperty(src)) {
      sourceState[src] = true;
      var sel = "#show_" + src
      $(sel).click( create_handle(src) )
      toggleButton(src, sourceState[src])
    }
  }

  reloadItems();
  refreshDates();
  setInterval(getNewItems,1000 * 60 * 5);
  setInterval(refreshDates,1000);
});

