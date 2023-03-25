const organizeTabs = async () => {
    const tabs = await chrome.tabs.query({});   
    console.log(tabs[0].url);
    console.log(tabs[0].title);


    // open ai magic

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

