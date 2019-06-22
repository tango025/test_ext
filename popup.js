groups = [ 'yoga'];
var fb_groups_s_url_list = [];
var fb_group_s_loop_count = -1;
var fb_cat_groups_loop_count = -1;
var group_arr = [];
var group_len;
var fb_cat_wise_group_count = -1;
function load_groups_for_check(){
fb_cat_wise_group_count++;
    console.log(fb_cat_wise_group_count +"/"+ (group_len-1))
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('navigng to : ' + group_arr[fb_cat_wise_group_count]);
        activeTab = tabs[0].id;
        chrome.tabs.update(tabs[0].id, { url: group_arr[fb_cat_wise_group_count] }, () => {
            chrome.tabs.onUpdated.addListener(function lak(tabid, changedInfo) {
                //dont load any images
                chrome.contentSettings['images'].get({
                    primaryUrl: tabs[0].url
                }, function (details) {
                    chrome.contentSettings['images'].set({
                        primaryPattern: 'https://www.facebook.com/*',
                        secondaryPattern: 'https://www.facebook.com/*',
                        setting: 'block'
                    })
                })
                //listener for when loading is complete
                if (changedInfo.status === "complete" && tabid == activeTab) {
                    console.log("sending message that group_page_loaded");
                    chrome.tabs.sendMessage(tabs[0].id, { greeting: "fb_group_page_loaded", keyword: groups[fb_cat_groups_loop_count], tabid: activeTab }, function (response) {
                        while (chrome.tabs.onUpdated.hasListener(lak) === true) {
                            chrome.tabs.onUpdated.removeListener(lak);
                        }
                    })
                }

            })    
        })
    })
}
function revisit_group_category_wise_for_approval(){
fb_cat_groups_loop_count++;
chrome.storage.local.get(groups[fb_cat_groups_loop_count],(res)=>{
    //for(each group link)
    console.log(res);
    group_arr = res[groups[fb_cat_groups_loop_count]];
    group_len = res[groups[fb_cat_groups_loop_count]].length;
    fb_cat_wise_group_count = -1;
    load_groups_for_check();
})
}
function store_in_local_storage(key,arr){
    console.log({ [key]: arr });
    chrome.storage.local.set({[key]:arr},()=>{
        console.log("stored the links in local storage");
    });
}
function main_fx_backend(request, sender, sendResponse) {
    if ('fb_group_search_page_loaded_response' in request){
        //store in local storage
        store_in_local_storage(request.keyword, request.fb_group_search_page_loaded_response);
        //if fb_groups_s_loop_count < url_list .length
        console.log(fb_group_s_loop_count + "/" + (fb_groups_s_url_list.length - 1));
        if(fb_group_s_loop_count<fb_groups_s_url_list.length-1)
        load_fb_groups_search_page();
        else{
            revisit_group_category_wise_for_approval();
        }
        //call load_fb_groups_search_page()
        //warna start searching local storage for group approval done
    }
    if ('fb_group_page_loaded_response' in request){
        //agar group list remains 
        if (fb_cat_wise_group_count<group_len-1) 
        //next group in the list
        load_groups_for_check();
        else if (fb_cat_wise_group_count = group_len - 1 && fb_cat_groups_loop_count<groups.length-1 ) 
        //new list if any left
        revisit_group_category_wise_for_approval()
        else console.log("Over");
        
    }
}

if (!chrome.runtime.onMessage.hasListener(main_fx_backend)) {
    chrome.runtime.onMessage.addListener(main_fx_backend);
}

function load_fb_groups_search_page(){
//go to the link
fb_group_s_loop_count++;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('navigng to : ' + fb_groups_s_url_list[fb_group_s_loop_count]);
        activeTab = tabs[0].id;
        chrome.tabs.update(tabs[0].id, { url: fb_groups_s_url_list[fb_group_s_loop_count] }, () => {
            chrome.tabs.onUpdated.addListener(function lakshadweep(tabid, changedInfo) {
                //dont load any images
                chrome.contentSettings['images'].get({
                    primaryUrl: tabs[0].url
                }, function (details) {
                    chrome.contentSettings['images'].set({
                        primaryPattern: 'https://www.facebook.com/*',
                        secondaryPattern: 'https://www.facebook.com/*',
                        setting: 'block'
                    })
                })
                //listener for when loading is complete
                if (changedInfo.status === "complete" && tabid == activeTab) {
                    console.log("sending message that fb_s_page_loaded");
                    chrome.tabs.sendMessage(tabs[0].id, { greeting: "fb_group_search_page_loaded", keyword: groups[fb_group_s_loop_count], tabid: activeTab }, function () {
                        while (chrome.tabs.onUpdated.hasListener(lakshadweep) === true) {
                            chrome.tabs.onUpdated.removeListener(lakshadweep);
                        }
                    })
                }
            })
        })
    })
}
function generate_fb_group_search_links(key){
    //get location
    var loc = $('input#location').val();
    fb_groups_s_url_list.push(`https://www.facebook.com/search/groups/?q=${key}+${loc}`)
}

function main(){
    console.log("mian starts");
    for (var loop_count = 0; loop_count < groups.length; loop_count++) 
    generate_fb_group_search_links(groups[loop_count]);
    console.log(fb_groups_s_url_list);
    load_fb_groups_search_page();
}
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelector('#submit').addEventListener(
            'click', main);
    });
})();