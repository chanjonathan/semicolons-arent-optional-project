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
    
    client.post('https://api.openai.com/v1/completions', params)
    .then( response => {
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
    }).catch( err => {
        console.log(err);
    });


}
const init = () => {
    const button = document.querySelector("button");
    button.addEventListener("click", organizeTabs);
}

init();

