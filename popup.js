const BASE_PROMPT = "categorize the tabs into different groups by similarity according to their titles into this format: \n" +
    "```\n" +
    "[{\"label\": \"\", \"tabId\":[\"\", \"\", \"\"...]}, {\"label\": \"\", \"tabId\":[\"\", \"\", \"\"...]}, ....]\n" +
    "```\n" +
    "Here are the tabs: \n";

const API_KEY = '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'

const organizeTabs = async () => {
    const tabs = await chrome.tabs.query({});   
    // console.log(tabs); 
    
    const parsedTabs = []
    
    for (var i = 0; i < tabs.length; i++) {
        parsedTabs.push({
            tabId: tabs[i].id,
            title: tabs[i].title
        });
    }

    console.log(BASE_PROMPT + JSON.stringify(parsedTabs));

    // open ai magic
    const client = axios.create({
        headers: { 'Authorization': 'Bearer ' + API_KEY }
    });

    const params = {
    prompt: "what is one plus one",
    model: "text-davinci-003", 
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
    }

    client.post('https://api.openai.com/v1/completions', params)
    .then( result => {
        console.log(result.data.choices[0].text);
    }).catch( err => {
    console.log(err);
    });
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

// parsedTabs is a stringified array of objects containing tabId and titles
// It should look like this:
// [{"tabId": "abc1", "title": "New Tab"}, {"tabId": "abc2", "title": "GitHub - UBC"}, {"tabId": "abc3", "title": "Outlook"}, {"tabId": "abc4", "title": "Youtube"}, {"tabId": "abc5", "title": "How to become a billionare"}, {"tabId": "abc6", "title": "10 Tips for Cat Lovers"}]
const prompt = "categorize the tabs into different groups by similarity according to their titles into this format: \n" +
    "```\n" +
    "[{\"label\": \"\", \"tabId\":[\"\", \"\", \"\"...]}, {\"label\": \"\", \"tabId\":[\"\", \"\", \"\"...]}, ....]\n" +
    "```\n" +
    "Here are the tabs: \n" + parsedTabs;

const init = () => {
    const button = document.querySelector("button");
    button.addEventListener("click", organizeTabs);
}

init();

