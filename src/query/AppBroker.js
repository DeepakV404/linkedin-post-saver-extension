export const AppBroker = {};

AppBroker.createPost = ({post, onSuccess}) => {
    const request = {
        message :   "chrome-storage",
        method  :   "createPost",
        post    :   post
    }

    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.createCollection = ({collection, onSuccess, onError}) => {
    const request = {
        message     :   "chrome-storage",
        method      :   "createCollection",
        collection  :   collection
    }

    window.chrome.runtime.sendMessage(request, (response) => {
        if(response.success){
            return onSuccess(response.data)
        }else{
            return onError("Collection already exists.")
        }
    })
}

AppBroker.getPosts = ({onSuccess}) => {
    const request = {
        message :   "chrome-storage",
        method  :   "getPosts"
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })

}

AppBroker.deletePost = ({post, onSuccess}) => {
    const request = {
        message :   "chrome-storage",
        method  :   "deletePost",
        post    :   post
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })

}

AppBroker.getOnboardingInfo = ({onSuccess}) => {
    const request = {
        message :   "chrome-storage",
        method  :   "getOnboardingInfo",
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.setOnboardingInfo = ({onboardingInfo, onSuccess}) => {
    const request = {
        message         :   "chrome-storage",
        method          :   "setOnboardingInfo",
        onboardingInfo  :   onboardingInfo
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.getMarketingInfo = ({onSuccess}) => {
    const request = {
        message :   "chrome-storage",
        method  :   "getMarketingInfo",
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.setMarketingInfo = ({marketingInfo, onSuccess}) => {
    const request = {
        message         :   "chrome-storage",
        method          :   "setMarketingInfo",
        marketingInfo   :   marketingInfo
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.getTags = ({onSuccess}) => {
    const request = {
        message :   "chrome-storage",
        method  :   "getTags"
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.getCollections = ({onSuccess}) => {
    const request = {
        message :   "chrome-storage",
        method  :   "getCollections"
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.openOptionsPage = ({onSuccess}) => {
    const request = {
        message :   "general",
        method  :   "openOptionsPage"
    }
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.getUserInfo = ({onSuccess}) => {
    const request = {
        message :   "chrome-storage",
        method  :   "getUserInfo"
    }
    
    window.chrome.runtime.sendMessage(request, (response) => {
        return onSuccess(response.data)
    })
}

AppBroker.updateUserInfo = ({userInfo, onSuccess, onError}) => {
    const request = {
        message     :   "chrome-storage",
        method      :   "updateUserInfo",
        userInfo    :   userInfo
    }

    window.chrome.runtime.sendMessage(request, (response) => {
        if(response.success){
            return onSuccess(response.data)
        }else{
            return onError("UserInfo update failed.")
        }
    })
}

AppBroker.executeApi = ({query, request, onSuccess, onFailure}) => {

    let finalRequest = {
        ...request,
        domain      :   `http://localhost:5000/${query}`,
        message     :   'api', 
    }

    window.chrome.runtime.sendMessage(finalRequest, function(response){
        
        if(response.status === 'api-error'){
            onFailure && onFailure(response.error);
        }
        else{
            if(response.data.errors){
                onFailure && onFailure(response.data.errors);
            }
            else{
                onSuccess && onSuccess(response.data);
            }
        }
    })
}