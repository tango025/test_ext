console.log('extension invoked');
var sleep_timer = 5000;
var fb_groups_link_array = [];
function fb_post_s_link_array_populate(){
//get href of groups links 
	var a = Array.from(document.getElementsByClassName("_52eh _5bcu"))
	for (var i = 0; i < a.length; i++)
		if (a[i].childNodes[0].href)
			fb_groups_link_array.push((a[i].childNodes[0].href).replace("www.", "m."))
	//store in local storage
	//[groupName :Array]
}
function make_fb_post(key){
	console.log(key);
	document.getElementsByClassName("_4g34 _6ber _78cq _7cdk _5i2i _52we")[0].click()
	setTimeout(() => {
		document.getElementsByName("message")[0].value = `JOIN THE SOCIAL NETWORK FOR ${key.toUpperCase()}\n https://ATG.world/go/${encodeURI(key)} .`;
		document.getElementsByClassName("_4wqt")[0].click()
		console.log("post made")},5000);
}
function main_fx(request, sender, sendResponse) {
	if (request.greeting == "fb_group_search_page_loaded"){
		$(document).ready(function () {
			// obtain links of groups for local storage
			setTimeout(() => {
				fb_post_s_link_array_populate();
			},sleep_timer);
			setTimeout(()=>{
				var a = document.getElementsByClassName("_4jy0 _4jy3 _517h _51sy _42ft");
				var arr = Object.keys(a).map((key) => a[key])
				var b = arr.filter(a => (a.outerHTML.includes("button") && a.outerHTML.includes("Pages can now join groups")) || a.outerHTML.includes("role=\"button\""));
				for (var i = 0; i < b.length; i++){  
					b[i].click();
					//if a user is also is a page admin
					if (document.getElementsByClassName("_271k _271m _1qjd").length>0){
						Array.from(document.getElementsByClassName("_271k _271m _1qjd")).filter(d => d.outerHTML.includes("joinButton"))[0].click()
				}}
					//if(POPUP_comeS)
				// while (document.getElementsByClassName("layerCancel").length>0)
				// {
				// 	for (var j = 0; j < document.getElementsByClassName("layerCancel").length; j++) 
				// 		document.getElementsByClassName("layerCancel")[j].click();
					
				// }
				//send Message
				console.log(fb_groups_link_array);
				chrome.runtime.sendMessage({fb_group_search_page_loaded_response:fb_groups_link_array,keyword:request.keyword},function(response){
					console.log("links sent");
				})				
			},sleep_timer+1000)
		})
	}
	if (request.greeting == "fb_group_page_loaded"){
		$(document).ready(function () {
			//check if request is pending or approved
			//if(approved) post
			setTimeout(()=>{
				if (document.getElementsByClassName("_55sr")[0]){
				if(document.getElementsByClassName("_55sr")[0].innerText === "Joined"){
				//post function
				make_fb_post(request.keyword);
			}
		}else console.log("request not approved");
			//send Message to move to next group
		
		},5000)
		setTimeout(()=>{
			chrome.runtime.sendMessage({ fb_group_page_loaded_response: "hello" }, function (response) {
				console.log("post made/invitation pending");
			})
		},12000)
		})
	}
}
//add listener for messages
if (!chrome.runtime.onMessage.hasListener(main_fx)) {
	chrome.runtime.onMessage.addListener(main_fx);
}
