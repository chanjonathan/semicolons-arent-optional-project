const parsedTabs = [];
const BASE_PROMPT = "categorize the tabs into different groups by similarity according to their titles into this format: \n" +
    "```\n" +
    "[{\"label\": \"\", \"tabId\":[\"\", \"\", \"\"...]}, {\"label\": \"\", \"tabId\":[\"\", \"\", \"\"...]}, ....]\n" +
    "```\n" +
    "Here are the tabs: \n";


const organizeTabs = async () => {
    const tabs = await chrome.tabs.query({});   
    // console.log(tabs); 

    
    for (var i = 0; i < tabs.length; i++) {
        parsedTabs.push({
            tabId: tabs[i].id,
            title: tabs[i].title
        });
    }

    console.log(BASE_PROMPT + JSON.stringify(parsedTabs));

    // open ai magic
    console.log(axios);

    const groupings = [];
    groupings.forEach(async (grouping) => {
        grouping.name
        const groupId = await chrome.tabs.group({ tabIds: grouping.tabIds });
        chrome.tabGroups.update(groupId, {
             collapsed: false,
             title: grouping.label
            });
    })
}


const init = () => {
    const button = document.querySelector("button");
    button.addEventListener("click", organizeTabs);
}

init();

