console.log('extension invoked');
var sleep_timer = 5000;
var fb_groups_link_array = [];
function fb_post_s_link_array_populate(){
//get href of groups links 
	var tri = document.getElementsByClassName("_52eh _ajx")
	for (var l in tri) 
		if (tri[l].firstChild.href && tri[l].firstChild != undefined)
			fb_groups_link_array.push(tri[l].firstChild.href)
	//store in local storage
	//[groupName :Array]

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
				chrome.runtime.sendMessage({fb_group_page_loaded_response:fb_groups_link_array,keyword:request.keyword},function(response){
					console.log("links sent");
				})				
			},sleep_timer+1000)
		})
	}
	if (request.greeting == "fb_group_page_loaded"){
		$(document).ready(function () {
			//check if request is pending or approved
			//if(approved) post
			if (document.getElementsByClassName("_42ft _4jy0 _55pi _2agf _4o_4 _p _4jy4 _517h _51sy")[0].innerText == "Joined"){
				//post function
			}
			//send Message to move to next
		})
	}
}
//add listener for messages
if (!chrome.runtime.onMessage.hasListener(main_fx)) {
	chrome.runtime.onMessage.addListener(main_fx);
}
