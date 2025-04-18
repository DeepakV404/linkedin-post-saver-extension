import $ from "jquery";

interface PostIdType{
    uniqueId    :   string | null, 
    postUniqueId:   string | null
}

export interface PostMeta{
    userInfo: {
        userName    :   string,
        userAvatar  :   string | null
    },
    postMeta: {
        postId              :   PostIdType,
        postContent         :   string | null,
        postThumbnailUrl    :   string | null,
        postUrl             :   string
    }

}

interface ScrapperType{
    getPostIdFromUrl        :   (postUrl: string) => PostIdType;
    getPostMetaFromIframe   :   ($content: any, postUrl: string) => PostMeta
}

interface HelperType{
    getPostIdFromUrl        :   (postUrl: string) => PostIdType;
    getPostData             :   (postUrl: string) => Promise<PostMeta>;
}

export const $scrapper  =  {} as ScrapperType;

export const $helper    =  {} as HelperType;

$helper.getPostIdFromUrl = (postUrl: string) => {

    const url = new URL(postUrl);

    const postId:PostIdType = {
        uniqueId        :   url.pathname.split("-activity-")[1] ?? url.pathname.split("/")[2],
        postUniqueId    :   url.pathname.split("/")[2] ?? window.crypto.randomUUID()
    }

    return postId;
}

$scrapper.getPostMetaFromIframe = ($content: any, postUrl: string) => {

    let data = {} as PostMeta;

    data["userInfo"] = {
        "userName"      :   $content.find(".update-components-actor__title span span").find('span[aria-hidden="true"]').first().text().trim() || "Anonymous",
        "userAvatar"    :   $content.find(".update-components-actor__avatar-image").attr('src') || null
    }

    data["postMeta"] = data["postMeta"] || {};

    data["postMeta"].postId     =   $helper.getPostIdFromUrl(postUrl);
    data["postMeta"].postUrl    =   postUrl;


    if ($content.find(".update-components-image--single-image").length) {
        data["postMeta"].postThumbnailUrl = $content.find(".update-components-image__image").attr('src') || null;
    }else if($content.find(".update-components-image__image-link")){
        data["postMeta"].postThumbnailUrl = $content.find(".ivm-view-attr__img--centered").first().attr('src')
    }else if($content.find(".update-components-linkedin-video__container").length){
        if($content.find(".vjs-poster-background")){
            data["postMeta"].postThumbnailUrl = $content.find("video").attr("poster") || null
        }
    }

    if ($content.find('.update-components-text').length) {
        const parser                    =   new DOMParser();
        const doc                       =   parser.parseFromString($content.find('.update-components-text').text(), 'text/html');
        const textContent               =   doc?.body?.textContent?.trim();
        data["postMeta"].postContent    =   textContent || null;
    }

    return data;
}

$helper.getPostData = (postUrl: string) => {

    return new Promise((resolve, reject) => {

        var postIframe              =   document.createElement('iframe');
        postIframe.id               =   "post-iframe";
        postIframe.style.display    =   'none';
        postIframe.src              =   postUrl;
        
        postIframe.onload = function() {
            const $content  =   $("#post-iframe").contents();

            let retries     =   5;

            const _process = () => {
                const postMeta = $scrapper.getPostMetaFromIframe($content, postUrl);
                $("#post-iframe").remove();
                resolve(postMeta)
            };
            
            const checkAndProcess = () => {
                if ($content.find(".feed-shared-update-v2").length) {
                    _process();
                } else if (retries > 0) {
                    retries--;
                    setTimeout(checkAndProcess, 1000);
                } else {
                    console.error("Element '.feed-shared-update-v2' not found after multiple retries.");
                }
            };
            checkAndProcess();
        };

        postIframe.onerror = function() {
            $("#post-iframe").remove();
            reject("Failed to load the #post-iframe content");
        };

        document.body.appendChild(postIframe);
    });
};


