import $ from "jquery";

export const DataScrapper = {};

DataScrapper.getPostId = () => {
    return window.location.pathname.split("/")[2];
}

DataScrapper.getPostImageUrl = () => {

    if($(".profile-photo-edit__preview").length) return $(".profile-photo-edit__preview").attr('src');

    return $(".pv-top-card-profile-picture__image").hasClass('ghost-person')  ? "" : $(".pv-top-card-profile-picture__image").attr('src')

}

DataScrapper.getPostURL = (postId) => {
    return new Promise((resolve, reject) => {
        const post = document.querySelector(`[data-id^="urn:li:activity:${postId}"], [data-urn*="urn:li:activity:${postId}"]`);
        if (!post) {
            reject(`Post with ID ${postId} not found`);
            return;
        }

        const dropdownMenu = post.querySelector(".artdeco-dropdown");
        if (!dropdownMenu) {
            reject("Dropdown menu not found");
            return;
        }

        const trigger = dropdownMenu.querySelector('.feed-shared-control-menu__trigger');
        if (!trigger) {
            reject("Control menu trigger not found");
            return;
        }

        trigger.click();

        let optionsDropdown = dropdownMenu.querySelector(".feed-shared-control-menu__content");
        if (optionsDropdown) {
            optionsDropdown.style.opacity = "0";
        }

        const _process = () => {
            const optionTrigger = optionsDropdown?.querySelector(".option-share-via .tap-target");
            if (optionTrigger) {
                optionTrigger.click();

                const toastsContainer = document.querySelector('.artdeco-toasts_toasts');
                if (toastsContainer) {
                    const toastLinks = toastsContainer.querySelectorAll('a.artdeco-toast-item__cta');

                    if (toastLinks.length > 0) {
                        let postUrl = toastLinks[0].getAttribute("href");
                        if (postUrl) {
                            const toastItem = toastLinks[0].closest(".artdeco-toast-item");
                            if (toastItem) {
                                toastItem.remove();
                            }

                            if (optionsDropdown) {
                                optionsDropdown.style.opacity = "1";
                            }

                            resolve(postUrl); // Return the URL
                            return;
                        }
                    }
                }
            }
            // If no toast or option trigger is found
            reject("Failed to retrieve post URL");
        };

        // Check for the option element or retry after a delay
        if (document.querySelector(".option-share-via")) {
            _process();
        } else {
            setTimeout(() => {
                _process();
            }, 2000);
        }
    });
};

DataScrapper.getPostMeta = () => {

    let data = {};
    
    data["postId"]          =   window.location.pathname.split("/")[2];
    data["title"]           =   $('title').text();
    data["postBy"]          =   `Post by ${$(".update-components-actor__title .visually-hidden").text()}`;
    data["userName"]        =   $(".update-components-actor__title span span").find('span[aria-hidden="true"]').first().text().trim();
    data["userAvatar"]      =   $(".update-components-actor__avatar-image").attr('src')
    data["url"]             =   window.location.href;
    data["postPerformance"] =   {
        "likes"     :   $(".social-details-social-counts__reactions-count").text().trim(),
        "comments"  :   $(".social-details-social-counts__comments button span").text().trim(),
    }


    if($('.update-components-text')){ 

        const parser        =   new DOMParser();
        const doc           =   parser.parseFromString($('.update-components-text').text(), 'text/html');
        const textContent   =   doc.body.textContent.trim();
        data["content"]     =   textContent;
    }
    
    if($(".update-components-image--single-image")){
        data["imageUrl"] = $(".update-components-image__image").attr('src');
    }

    return data;
}

DataScrapper.fetchLoginUserInfo = () => {

    let href = $(".profile-card-profile-link").attr("href");
    
    if (!href) {
        href = $(".feed-identity-module__actor-meta a").attr("href");
    }

    let info        =   {
        href        :   href,
        slug        :   href.split("/")[2],
        linkedInUrl :   `https://www.linkedin.com${href}`
    };

    return info
};

DataScrapper.getPostMetaFromIframe = ($content, postId, postUrl) => {
    
    let data = {};

    data["userName"]    =   $content.find(".update-components-actor__title span span").find('span[aria-hidden="true"]').first().text().trim() || "Anonymous";
    data["userAvatar"]  =   $content.find(".update-components-actor__avatar-image").attr('src') || null;


    if ($content.find(".update-components-image--single-image").length) {
        data["imageUrl"] = $content.find(".update-components-image__image").attr('src') || null;
    }else if($content.find(".update-components-image__image-link")){
        data["imageUrl"] = $content.find(".ivm-view-attr__img--centered").first().attr('src')
    }else if($content.find(".update-components-linkedin-video__container").length){
        if($content.find(".vjs-poster-background")){
            data["imageUrl"] = $content.find("video").attr("poster") || null
        }
    }


    if ($content.find('.update-components-text').length) {
        const parser        =   new DOMParser();
        const doc           =   parser.parseFromString($content.find('.update-components-text').text(), 'text/html');
        const textContent   =   doc.body.textContent.trim();
        data["content"]     =   textContent || null;
    }

    // data["postPerformance"] = {
    //     likes: $content.find(".social-details-social-counts__reactions-count").text().trim() || "0",
    //     comments: $content.find(".social-details-social-counts__comments button span").text().trim() || "0",
    // };

    return data;
};

DataScrapper.getPostMetaFromElement = (element) => {
    const $content = $(element);

    let data = {};

    data["userName"]   =   $content.find(".update-components-actor__title span span").find('span[aria-hidden="true"]').first().text().trim() || "Anonymous";
    data["userAvatar"] =   $content.find(".update-components-actor__avatar-image").attr('src') || null;

    if ($content.find(".update-components-image--single-image").length) {
        data["imageUrl"] = $content.find(".update-components-image__image").attr('src') || null;
    } else if ($content.find(".update-components-image__image-link").length){
        data["imageUrl"] = $content.find(".ivm-view-attr__img--centered").first().attr('src') || null;
    } else if ($content.find(".update-components-linkedin-video__container").length){
        if($content.find(".vjs-poster-background").length){
            data["imageUrl"] = $content.find("video").attr("poster") || null;
        }
    }

    if ($content.find('.update-components-text').length) {
        const parser        =   new DOMParser();
        const doc           =   parser.parseFromString($content.find('.update-components-text').text(), 'text/html');
        const textContent   =   doc.body.textContent.trim();
        data["content"]     =   textContent || null;
    }

    return data;
}

DataScrapper.getchPostData = (postId, postUrl) => {

    return new Promise((resolve, reject) => {
        var postIframe              =   document.createElement('iframe');
        postIframe.id               =   "post-frame";
        postIframe.style.display    =   'none';
        postIframe.src              =   postUrl;
        
        postIframe.onload = function() {
            const $content = $("#post-frame").contents();

            const _process = () => {
                const postMeta = DataScrapper.getPostMetaFromIframe($content, postId, postUrl);
                $("#post-frame").remove();
                resolve(postMeta)
            };
            
            if ($content.find('[class^="feed-shared-update-v2"]').length){
                _process();
            } else {
                setTimeout(() => {
                    _process();            
                }, 2500);
            }
        };

        postIframe.onerror = function() {
            $("#post-frame").remove();
            reject("Failed to load the iframe content");
        };

        document.body.appendChild(postIframe);
    });
};
