/*global chrome*/

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        active: true,
        url:  'get-started.html'
    }, null);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if(changeInfo.status === 'complete' && (tab.url.startsWith("https://www.linkedin.com") || tab.url.startsWith("chrome-extension://"))) 
    {
        fetch('./asset-manifest.json')
          .then((response) => response.json())
            .then((json) => {
                let allfiles  = json.entrypoints;

                let cssFiles  = []
                let jsFiles   = []

                allfiles.map(file => {
                    let ext = file.split('.')[file.split('.').length - 1];
                    if(ext === "css") cssFiles.push(file)
                    if(ext === "js") jsFiles.push(file)
                })

                chrome.scripting.insertCSS({
                    target: { tabId: tabId },
                    files: cssFiles
                })
                    .then(() => {
                        
                        console.log("[SERVICE_WORKER] INJECTED THE FOREGROUND STYLES.");

                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: jsFiles
                        })
                            .then(() => {
                                
                                console.log("[SERVICE_WORKER] INJECTED THE FOREGROUND SCRIPT.");

                                chrome.tabs.sendMessage( tabId, {
                                    message: 'URL_CHANGE',
                                    url: tab.url
                                })
                            });
                    })
                    .catch(err => console.log(err));

            });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.message === 'api') 
    {
        let reqData = {
            method      : request.method
        }

        if(request.headers){
            reqData.headers = request.headers;
        }

        if(request.body){
            reqData.body = JSON.stringify(request.body);
        }

        fetch(request.domain ,reqData)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                sendResponse({
                    status: 'api-success',
                    data : data
                });
            })
            .catch(error => {
                sendResponse({
                    status : 'api-error',
                    error  :  error
                });
            });

        return true;   
    }

    else if(request.message === "general"){
        if(request.method === "openOptionsPage"){
            chrome.runtime.openOptionsPage();
        }
    }
    else if(request.message === "chrome-storage")
    {
        if(request.method === "getOnboardingInfo"){
            chrome.storage.local.get("onboardingInfo", (result) => {
                const onboardingInfo = result.onboardingInfo || {};
                sendResponse({ data: onboardingInfo });
            });
            return true;
        }
        else if(request.method === "setOnboardingInfo"){
            chrome.storage.local.set({ onboardingInfo: request.onboardingInfo }, () => {
                sendResponse({ success: true });
            });
            return true;
        }
        else if(request.method === "getMarketingInfo"){
            chrome.storage.local.get("marketingInfo", (result) => {
                const marketingInfo = result.marketingInfo || {};
                sendResponse({ data: marketingInfo });
            });
            return true;
        }
        else if(request.method === "setMarketingInfo"){
            chrome.storage.local.set({ marketingInfo: request.marketingInfo }, () => {
                sendResponse({ success: true });
            });
            return true;
        }
        else if (request.method === "getPosts") {
            chrome.storage.local.get("posts", (result) => {
                const posts = result.posts || {};
                sendResponse({ data: posts });
            });
            return true;
        } 
        else if(request.method === "getCollections"){
            chrome.storage.local.get("collections", (result) => {
                const collections = result.collections || [];
                sendResponse({ data: collections });
            });
            return true
        }
        else if(request.method === "getTags"){
            chrome.storage.local.get("tags", (result) => {
                const tags = result.tags || [];
                sendResponse({ data: tags });
            });
            return true
        }
        else if(request.method === "deletePost"){
            const toDeletePost = request.post;
            chrome.storage.local.get("posts", (result) => {
                const posts = result.posts || {};
                delete posts[toDeletePost.id]
                chrome.storage.local.set({ posts }, () => {
                    sendResponse({ success: true, data: posts });
                });
            });
            return true;
        }
        else if (request.method === "createCollection") {
            const newCollection = request.collection;
        
            chrome.storage.local.get("collections", (result) => {
                const existingCollections = result.collections || [];
        
                if (!existingCollections.includes(newCollection)) {
                    const updatedCollections = [...existingCollections, newCollection];
                    chrome.storage.local.set({ collections: updatedCollections }, () => {
                        sendResponse({ success: true, data: updatedCollections });
                    });
                } else {
                    sendResponse({ success: false, message: "Collection already exists" });
                }
            });
            return true;
        }
        else if (request.method === "createPost"){
            const newPost = request.post;
            if (!newPost || !newPost.id) {
                sendResponse({ success: false, error: "Invalid post object" });
                return false;
            }

            chrome.storage.local.get("tags", (result) => {
                const existingTags = result.tags || [];
            
                const uniqueTags = newPost.tags.filter((tag) => !existingTags.includes(tag));
            
                if (uniqueTags.length > 0) {
                    const updatedTags = [...existingTags, ...uniqueTags];
            
                    chrome.storage.local.set({ tags: updatedTags }, () => {
                        console.log("Updated tags:", updatedTags);
                    });
                } else {
                    console.log("No new tags to add. Existing tags:", existingTags);
                }
            });
    
            chrome.storage.local.get("posts", (result) => {
                const posts = result.posts || {};
                posts[newPost.id] = {
                    id              :   newPost.id,
                    title           :   newPost.title,
                    url             :   newPost.url,
                    tags            :   newPost.tags,
                    note            :   newPost.note,
                    imageUrl        :   newPost.imageUrl,
                    content         :   newPost.content,
                    collection      :   newPost.collection,
                    postPerformance :   newPost.postPerformance,
                    postBy          :   newPost.postBy,
                    user            :   {
                        name        :   newPost.userName,
                        avatar      :   newPost.userAvatar
                    },
                    userInfo        :   {
                        userName    :   newPost.userName,
                        userAvatar  :   newPost.userAvatar
                    },
                    createdOn       :   new Date().valueOf()
                };
    
                chrome.storage.local.set({ posts }, () => {
                    sendResponse({ success: true, data: posts });
                });
            });
            return true;
        }
        else if(request.method === "updateUserInfo"){
            chrome.storage.local.set({ userInfo: request.userInfo }, () => {
                sendResponse({ success: true, data: request.userInfo });
            });
        }
        else if(request.method === "getUserInfo"){
            chrome.storage.local.get("userInfo", (result) => {
                const userInfo = result.userInfo || {};
                sendResponse({ data: userInfo });
            });
            return true
        }
    }

});