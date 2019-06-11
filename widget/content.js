var g_data;
var position = {};

function getData(){
	var header = document.getElementsByName("problem")[0].querySelector("table").children[0].children[0];
	for(var i = 0; i <= header.childElementCount-1; i ++){
		var th = header.children[i];
		var html = th.innerHTML;
		if(html.indexOf("時間") != -1 && html.indexOf("持續時間") == -1) position.timeStart = i;
		if(html.indexOf("Recovery time") != -1) position.timeEnd = i;
		if(html.indexOf("主機") != -1) position.server = i;
		if(html.indexOf("問題") != -1) position.error = i; 
	}
	g_data = document.getElementsByName("problem")[0].querySelector("table").children[1];
	//console.log(position);
}
function analy(id){
	var line = g_data.children[id];

	var timeStr_start = line.children[position.timeStart].querySelector("a");
	if(timeStr_start){
		timeStr_start = timeStr_start.innerHTML;
	}else{
		return undefined;
	}
	var timeStr_end = line.children[position.timeEnd].querySelector("a");
	if(timeStr_end){
		timeStr_end = timeStr_end.innerHTML;
	}
	var serverStr = line.children[position.server].querySelector("a");
	if(serverStr){
		serverStr = serverStr.innerHTML;
	}
	var errorStr_source = line.children[position.error].querySelector("a");
	if(errorStr_source){
		errorStr_source = errorStr_source.innerHTML;
	}

	var errorStr = "";
	if(errorStr_source) errorStr = errorStr_source.replace(serverStr, "").replace("主機", "").replace(" on ", "");
	var returnObj = {
		"timeStr_start" : timeStr_start,
		"timeStr_end" : timeStr_end,
		"serverStr" : serverStr,
		"errorStr" : errorStr,
		"errorStr_source" : errorStr_source
	}
	return returnObj;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(document.body.baseURI.indexOf("zabbix.php?action=problem.view") == -1){
		sendResponse(null);
		return;
	}
	getData();
	if(request.com == 0){
		var return_arr = [];
		for(var i = 0; i <= g_data.childElementCount-1; i ++){
			var res = analy(i);
			if(res){
				return_arr.push(res);
			}else{
				return_arr.push("Empty Row");
			}
		}
	    sendResponse(return_arr);
	}else if(request.com == 1){
		var tr = g_data.children[request.index];
		if(request.action == "On"){
			tr.style.backgroundColor = "#e8f5ff";
		}else if(request.action == "Off"){
			tr.style.backgroundColor = "#ffffff";
		}
		sendResponse(tr);
	}
});

