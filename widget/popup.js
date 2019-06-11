var textarea_node;
var lastTextareaCount;
var lastResponse;

var boostrapColor = ["btn-primary", "btn-secondary", "btn-success", "btn-danger", "btn-warning", "btn-info", "btn-dark"]


function tgStrGen(obj) {
	return "時間：" + obj.timeStr_start + "\n主機：" + obj.serverStr + "\n告警：" + obj.errorStr;
}
function exStrGen(obj){
	var hour = parseInt(obj.timeStr_start.substring(0, 2));
	var className = "";
	if(hour >= 23 || hour <= 6){
		className = "晚班";
	}else if(hour >= 7 && hour < 15){
		className = "早班";
	}else{
		className = "中班";
	}
	return "\t告警\t" + className + "\t" + addDate(obj.timeStr_start) + "\t\t" + addDate(obj.timeStr_end) + "\t\t\t" + obj.errorStr_source + "\t" + obj.serverStr;
}

function addDate(str){
	var dt = new Date();
	var ar;
	if(str){
		if(str.length > 9){
			ar = str.split(":")
			return (ar[0] + ":" + ar[1]).split("-").join("/");
		}else{
			ar = str.split(":");
			return dt.getFullYear() + "/" + ((dt.getMonth() + 1) < 10 ? "0" : "") + (dt.getMonth() + 1) + "/" + (dt.getDate() < 10 ? "0" : "") + dt.getDate() + " " + ar[0] + ":" + ar[1];
		}
	}else{
		return "Error : Time Not Found";
	}
}

function highlight(i, ac){
	chrome.tabs.query({ active: true, currentWindow: true}, function(tabs){  
	    chrome.tabs.sendMessage(tabs[0].id, {com: 1, index: i, action: ac}, function(response){
	    	var tr = response;
	    }); 
	});
}

function getPreStr(id){
	var preStr = "";
	switch(id[2]){
		case 0: 
			preStr = "startText";
			break;
		case 1: 
			preStr = "endText";
			break;
		case 2: 
			preStr = "serverText";
			break;
		case 3: 
			preStr = "errorText";
			break;
	}
	if(id[1] == 0){
		if(id[2] == 0){
			preStr = "tgText";
		}else if(id[2] == 1){
			preStr = "exText";
		}
	} 
	return preStr;
}

function copy(id, node){
	var text_el;
	if(textarea_node){
		var el = document.getElementById("textarea" + lastTextareaCount[0]);
		if(el){
			el.removeChild(textarea_node);
		}
	}
	if(node){
		text_el = node;
	}else{
		text_el = document.createElement('textarea');
	}

	var preStr = getPreStr(id);

	text_el.value = document.getElementById(preStr+id[0]).innerHTML;
	document.getElementById("textarea" + id[0]).appendChild(text_el);

	textarea_node = text_el;
	lastTextareaCount = id;

	text_el.select();
	document.execCommand('copy');
}

function main(){
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {  
	    chrome.tabs.sendMessage(tabs[0].id, {com: 0}, function(response) {
	        console.log(response);
	        if(JSON.stringify(response) === JSON.stringify(lastResponse) ) return;
	        if(!response){
	        	document.getElementById("main").innerHTML = "<tr><td>Oops，Page Worng! Try Problem Page!</td></tr>";
	        	return;
	        } 
	        lastResponse = response;
	        textarea_node = undefined;
	        document.getElementById("main").innerHTML = "";
	        var hasData = false;
	        for(let i = 0; i <= response.length-1; i ++){
	        	var data = response[i];
	        	if(response[i] == "Empty Row") continue;

	        	hasData = true;

	        	var colorStr = boostrapColor[i % boostrapColor.length];
	        	var headerStrTr = "<tr class=\"highlight" + i + "\"><td colspan=\"4\"><p>" + data.serverStr + "</p></td></tr>";

	        	var tgBtnStr = "<td colspan=\"2\"><button class=\"btn " + colorStr + "\" id=\"tgBtn" + i + "\">Telegram</button></td>";
	        	var exBtnStr = "<td colspan=\"2\"><button class=\"btn " + colorStr + "\" id=\"exBtn" + i + "\">Excel</button></td>";
	        	var tr1 = "<tr class=\"highlight" + i + "\">" + tgBtnStr + exBtnStr + "</tr>";

	        	var startBtnStr = "<td><button class=\"btn " + colorStr + "\" id=\"startBtn" + i + "\">開始時間</button></td>";
	        	var endBtnStr = "<td><button class=\"btn " + colorStr + "\" id=\"endBtn" + i + "\">結束時間</button></td>";
	        	var serverBtnStr = "<td><butto class=\"btn " + colorStr + "\"n id=\"serverBtn" + i + "\">系統</button></td>";
	        	var errorBtnStr = "<td><button class=\"btn " + colorStr + "\" id=\"errorBtn" + i + "\">事件描述</button></td>";
	        	var tr2 = "<tr class=\"highlight" + i + "\">" + startBtnStr + endBtnStr + serverBtnStr + errorBtnStr + "</tr>";

	        	document.getElementById("main").insertAdjacentHTML('beforeend', headerStrTr);
	        	document.getElementById("main").insertAdjacentHTML('beforeend', tr1);
	        	document.getElementById("main").insertAdjacentHTML('beforeend', tr2);
	        	document.getElementById("main").insertAdjacentHTML('beforeend', "<tr class=\"highlight" + i + "\"><td colspan=\"4\" id=\"textarea" + i + "\"></td></tr>");

	        	var tgText = "<p id=\"tgText" + i + "\" class=\"hide\">" + tgStrGen(data) + "</p>";
	        	var exText = "<p id=\"exText" + i + "\" class=\"hide\">" + exStrGen(data) + "</p>";
	        	var startText = "<p id=\"startText" + i + "\" class=\"hide\">" + addDate(data.timeStr_start) + "</p>";
	        	var endText = "<p id=\"endText" + i + "\" class=\"hide\">" + addDate(data.timeStr_end) + "</p>";
	        	var serverText = "<p id=\"serverText" + i + "\" class=\"hide\">" + data.serverStr + "</p>";
	        	var errorText = "<p id=\"errorText" + i + "\" class=\"hide\">" + data.errorStr_source + "</p>";

	        	document.getElementById("main").insertAdjacentHTML("beforeend", tgText + exText + startText + endText + serverText + errorText);

				var tgBtn = document.getElementById("tgBtn"+i), clone_tgBtn = tgBtn.cloneNode(true);
				tgBtn.parentNode.replaceChild(clone_tgBtn, tgBtn);
				var exBtn = document.getElementById("exBtn"+i), clone_exBtn = exBtn.cloneNode(true);
				exBtn.parentNode.replaceChild(clone_exBtn, exBtn);
				var startBtn = document.getElementById("startBtn"+i), clone_startBtn = startBtn.cloneNode(true);
				startBtn.parentNode.replaceChild(clone_startBtn, startBtn);
				var endBtn = document.getElementById("endBtn"+i), clone_endBtn = endBtn.cloneNode(true);
				endBtn.parentNode.replaceChild(clone_endBtn, endBtn);
				var serverBtn = document.getElementById("serverBtn"+i), clone_serverBtn = serverBtn.cloneNode(true);
				serverBtn.parentNode.replaceChild(clone_serverBtn, serverBtn);
				var errorBtn = document.getElementById("errorBtn"+i), clone_errorBtn = errorBtn.cloneNode(true);
				errorBtn.parentNode.replaceChild(clone_errorBtn, errorBtn);

	        	document.getElementById("tgBtn"+i).addEventListener('click', function(){copy([i, 0, 0]);});
	        	document.getElementById("exBtn"+i).addEventListener('click', function(){copy([i, 0, 1]);});
	        	document.getElementById("startBtn"+i).addEventListener('click', function(){copy([i, 1, 0]);});
	        	document.getElementById("endBtn"+i).addEventListener('click', function(){copy([i, 1, 1]);});
	        	document.getElementById("serverBtn"+i).addEventListener('click', function(){copy([i, 1, 2]);});
	        	document.getElementById("errorBtn"+i).addEventListener('click', function(){copy([i, 1, 3]);});

	        	var highlights = document.getElementsByClassName("highlight" + i);
	        	for(var j = 0; j <= highlights.length-1; j ++){
	        		highlights[j].addEventListener("mouseenter", function(){highlight(i, "On")});
	        		highlights[j].addEventListener("mouseleave", function(){highlight(i, "Off")});
	        	}
	        }
	        if(!hasData){
	        	document.getElementById("main").innerHTML = "<tr><td>Oops，No Data Found!</td></tr>";
	        	return;
	        }
	    });  
	});
}

function loop(){
	main();
	setTimeout(loop, 2000);
};

window.onload = main;
setTimeout(loop, 2000);
