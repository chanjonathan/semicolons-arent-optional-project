const API_KEY = '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'

const organizeTabs = async () => {
    const tabs = await chrome.tabs.query({});    

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

