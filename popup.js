const BASE_PROMPT = "categorize the tabs into no more than 6 different groups by similarity according to their titles into this format: \n" +
    "```\n" +
    "[{\"label\": \"\", \"tabIds\":[\"\", \"\", \"\"]}, {\"label\": \"\", \"tabIds\":[\"\", \"\", \"\"]} ]\n" +
    "```\n" +
    "\n";

const API_KEY = '';

const organizeTabs = async (method) => {
    const tabs = await chrome.tabs.query({});   

    const parsedTabs = []
    for (var i = 0; i < tabs.length; i++) {
        parsedTabs.push({
            tabId: tabs[i].id,
            title: tabs[i].title
        });
    }

    const client = axios.create({
        headers: { 'Authorization': 'Bearer ' + API_KEY }
    });

    const params = {
    prompt: BASE_PROMPT + JSON.stringify(parsedTabs),
    model: "text-davinci-003", 
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
    }
    
    client.post('https://api.openai.com/v1/completions', params)
    .then( response => {

        const groupings = JSON.parse(response.data.choices[0].text);
        
        groupings.forEach(async (grouping) => {

            if (method === 'group') {
                const groupId = await chrome.tabs.group({ tabIds: grouping.tabIds });
                chrome.tabGroups.update(groupId, {
                    collapsed: false,
                    title: grouping.label
                    });
            }

            if (method === 'window') {
                chrome.windows.create({
                    tabId: grouping.tabIds[0],
                    focused: true
                  }, (window) => {
                    grouping.tabIds.slice(1, grouping.tabIds.length).forEach((tabId) => {
                        chrome.tabs.move(tabId, { windowId: window.id, index: -1 });
                    })
                  });
            }
        })
    }).catch( error  => {
        console.log(error);
    });


}
const init = () => {
    const groupButton = document.getElementById("group-button");
    groupButton.addEventListener("click", () => { organizeTabs('group') });
    const windowButton = document.getElementById("window-button");
    windowButton.addEventListener("click", () => { organizeTabs('window') });
}

init();

