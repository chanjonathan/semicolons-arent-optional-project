const BASE_PROMPT = "categorize the tabs into different groups by similarity according to their titles into this format: \n" +
    "```\n" +
    "[{\"label\": \"\", \"tabId\":[\"\", \"\", \"\"...]}, {\"label\": \"\", \"tabId\":[\"\", \"\", \"\"...]}, ....]\n" +
    "```\n" +
    "\n";

const API_KEY = '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';

const organizeTabs = async () => {
    const tabs = await chrome.tabs.query({});   

    const parsedTabs = []
    for (var i = 0; i < tabs.length; i++) {
        parsedTabs.push({
            tabId: tabs[i].id,
            title: tabs[i].title
        });
    }

    console.log(BASE_PROMPT + JSON.stringify(parsedTabs));

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

    response = await client.post('https://api.openai.com/v1/completions', params);

    console.log(response);

    const groupings = JSON.parse(response.data.choices[0].text);

    console.log(groupings);

    groupings.forEach(async (grouping) => {
        console.log(grouping);
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

