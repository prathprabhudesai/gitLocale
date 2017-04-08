var userLocationData = [];
var client_id = "client_id=xxxxx"
var client_secret = "client_secret=xxxxx"
var names = []
var locations = []


function getUniqueMap(arr) {
  var o = {}
  for (var i = 0; i < arr.length; i++) o[arr[i]] = 1
  return o
}


function getHeightWidth(arr){
  return (arr.length*20 > 700 ? 700 : arr.length*20);
}


function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

function main() {
  var info = extractUserRepoNames(document.getElementById("name_repo").value);
  var repositories = getJSONFile("https://api.github.com/users/" + info.user + "/repos?" + client_id + "&" + client_secret);
  if(repositories != String.null) {
    var repository_id = getTheRepoId(repositories,info.repo)
    var contributors = getJSONFile("https://api.github.com/repositories/" + repository_id + "/contributors?" + client_id + "&" + client_secret);

    if(contributors != String.null){
      extractUserLocationData(contributors);
      for(var i=0; i < userLocationData.length; i++){
        if(userLocationData[i].name != String.null && userLocationData[i].location != String.null ){
          names.push(userLocationData[i].name);
          locations.push(userLocationData[i].location);
        }
      }

      var location_map = getUniqueMap(locations)

      for(var i=0; i<locations.length; i++){
        location_map[locations[i]] += 1
      }


      var data_values = [];
      var data_labels = Object.keys(location_map);
      for (var i = 0; i < data_labels.length; i++) {
        data_values.push(location_map[data_labels[i]])
      }


      if (typeof(url) !== "string")  throw "getJSONFile: parameter not a string";
      else {
        var httpReq = new XMLHttpRequest(); // a new http request
        httpReq.open("GET",url,false); // init the request
        httpReq.send(null); // send the request
        var startTime = Date.now();
        while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
          if ((Date.now()-startTime) > 3000)
            break;
        } // until its loaded or we time out after three seconds
        if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
          throw "Unable to open JSON file!";
        else
          return JSON.parse(httpReq.response);
      } // end if good params
    } // end try

    catch(e) {
      console.log(e);
      return(String.null);
    }
  }