function analy(id){
	var table = document.getElementsByName("problem")[0].querySelector("table").children[1];
	var line = table.children[id];

	var timeStr = line.children[0].querySelector("a").innerHTML;
	var serverStr = line.children[6].querySelector("a").innerHTML;
	var errorStr = line.children[7].querySelector("a").innerHTML;

	errorStr = errorStr.replace(serverStr, "").replace("主機", "").replace(" ", "").replace("on", "");
	var returnObj = {
		"timeStr" : timeStr,
		"serverStr" : serverStr,
		"errorStr" : errorStr
	}
	return returnObj;
}
function helper(id) {
	id --;
	var obj = analy(id);
	console.log("時間：" + obj.timeStr + "\n主機：" + obj.serverStr + "\n告警：" + obj.errorStr);
}