import { useEffect, useState } from "react";
import { Avatar, Button, Drawer, Space, Tooltip } from "antd";
import { MdClose, MdOutlineMenu } from "react-icons/md";
import { createRoot } from 'react-dom/client';


import { getPostsArray } from "../../options/options-transformer.ts";
import { DataScrapper } from "../../helper/DataScrapper.js";
import { AppBroker } from "../../query/AppBroker.js";

import BookmarkListButton from "./bookmark/bookmark-list-button.tsx";
import OptionsContainer from "../../options/options-container.tsx";
import ShareOnLinkedin from "./share-on-linkedin.tsx";
import NotPostPage from "./not-post-page.tsx";
import PostForm from "../post/post-form.tsx";
import GetEmail from "./get-email.tsx";
import { $helper, $scrapper } from "../../helper/helper.ts";

const OPTIONS_PAGE      =   "OPTIONS_PAGE";
const POST_PAGE         =   "POST_PAGE";
const FEED_PAGE         =   "FEED_PAGE";

const Layout = () => {

    const [posts, setPosts]                 =   useState([]);
    const [isOnboarded, setIsOnboarded]     =   useState(false);
    const [page, setPage]                   =   useState();
    const [visible, setVisible]             =   useState(window.location.hash.split("#")[1] === "open-panel" ? true : false);
    const [postId, setPostId] 	            =   useState("");
    const [showShareOn, setShowShareOn]     =   useState(false);
    const [initialValue, setInitialValue]   =   useState(null);
    const [showNoPost, setShowNoPost]       =   useState(false);
    const [loading, setLoading]             =   useState(false);

    useEffect(() => {
        // set open-modal hash to empty
        window.location.hash = "";
    }, [])

    useEffect(() => {
        // get onboarding details
        AppBroker.getOnboardingInfo({
            onSuccess: (data) => {
                data.isOnboarded ? setIsOnboarded(true) : setIsOnboarded(false)
            }
        })
    }, [])

    useEffect(() => {
        AppBroker.getUserInfo({
            onSuccess: (data) => {

                console.log("data: in get user info",data)
                if(!data.slug){
                    const userInfo = DataScrapper.fetchLoginUserInfo() ?? {};
                    console.log("userInfo: from scrapper",userInfo)

                    AppBroker.updateUserInfo({
                        userInfo: userInfo,
                        onSuccess: () => {}
                    })
                }
            }
        })
    }, [])

    useEffect(() => {
        AppBroker.getMarketingInfo({
            onSuccess: (data) => {
                if(data.sharedOnLinkedIn || data.sharedOnLinkedIn === "later"){
                    setShowShareOn(false)
                }else{
                    if(posts.length >= 5){
                        setShowShareOn(true)
                    }
                }
            }
        })
    }, [posts])

    useEffect(() => {
        AppBroker.getPosts({
            onSuccess: (data) => {
                setPosts(getPostsArray(data))
            }
        })
    }, [initialValue])

    useEffect(() => {
        window.chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if(request.message === 'URL_CHANGE') {
                    setPostId(DataScrapper.getPostId());
                }
            }
        );
    }, [])

    useEffect(() => {
        if(window.location.origin !== "https://www.linkedin.com"){
            setPage(OPTIONS_PAGE)
        }else if (window.location.pathname.startsWith('/posts')) {
            setPage(POST_PAGE)
        }else if(window.location.pathname.startsWith('/feed')){
            setPage(FEED_PAGE)
        }
    }, [])

    const postDescriptions  =   document.querySelectorAll('.update-components-actor__description');

    postDescriptions.forEach((post) => {
        post.style.maxWidth = '160px';
    });

    function createSavePostDiv() {
        const container = document.createElement('div');
        container.className = 'j-bookmark-button'

        const button = document.createElement('button');
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.columnGap= '4px';
        button.style.color = 'inherit'
    
        const img = document.createElement('img');
        img.alt = 'Logo';
        img.src = 'https://static.buyerstage.io/static-assets/buyerstage-product-logo.svg';
        img.width = 20;
        img.height = 20;
    
        const textDiv = document.createElement('span');
        textDiv.textContent = 'Save Post';
        textDiv.style.fontSize = '13px';

        button.appendChild(img);
        button.appendChild(textDiv);

        container.appendChild(button);
    
        return container;
    }

    const buildInitialValueFromCurrentPage = () => {
        const meta = DataScrapper.getPostMeta();
        return {
            userInfo: {
                userName: meta.userName,
                userAvatar: meta.userAvatar,
            },
            postMeta: {
                postId: {
                    uniqueId: meta.postId,
                    postUniqueId: meta.postId,
                },
                postContent: meta.content,
                postThumbnailUrl: meta.imageUrl,
                postUrl: meta.url,
            },
        };
    };

    const buildInitialValueFromElement = (element, postId) => {
        const meta = DataScrapper.getPostMetaFromElement(element);
        return {
            userInfo: {
                userName: meta.userName,
                userAvatar: meta.userAvatar,
            },
            postMeta: {
                postId: {
                    uniqueId: postId,
                    postUniqueId: postId,
                },
                postContent: meta.content,
                postThumbnailUrl: meta.imageUrl,
                // We cannot reliably build a canonical post URL without extra requests; use current page
                postUrl: window.location.href,
            },
        };
    };
    
    const injectSavePostButtons = () => {

        if(page === POST_PAGE){
            const posts =   document.querySelectorAll('.update-components-actor__container');
    
            posts.forEach((post) => {
                if (!post.querySelector('.j-bookmark-button')) {
                    let button = createSavePostDiv()
                    button.addEventListener('click', () => {
                        setVisible(true)
                        setLoading(false)
                        const initial = buildInitialValueFromCurrentPage();
                        setInitialValue(initial)
                    });
                    post.appendChild(button);
                }
            });
        }else {
                
            const posts = Array.from(document.querySelectorAll('[data-id^="urn:li:activity:"]'));

            const aggregatePosts = Array.from(document.querySelectorAll('[data-id^="urn:li:aggregate:"]'))
                                        .filter(el => el.getAttribute('data-id').includes('urn:li:activity:'));

            const allPosts = [...posts, ...aggregatePosts];

            allPosts.forEach((postElement) => {
                const dataId = postElement.getAttribute('data-id');
                const postId = dataId.split(':').pop();

                const actorContainer = postElement.querySelector('.update-components-actor__container');

                if (actorContainer) {
                    if (!actorContainer.querySelector('.j-bookmark-button')) {
                        let button = createSavePostDiv()
                        button.addEventListener('click', () => {
                            setVisible(true)
                            setLoading(false)
                            const initial = buildInitialValueFromElement(postElement, postId)
                            setInitialValue(initial)
                        });
                        actorContainer.appendChild(button);
                    }
                } 
            });
        }
    }

    useEffect(() => {
        if(page !== OPTIONS_PAGE){

            injectSavePostButtons();

            const observer = new MutationObserver(() => {
                injectSavePostButtons();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            return () => observer.disconnect();
        }

    }, [page]);

    const handleListClick = () => {
        AppBroker.openOptionsPage({
            onSuccess : () => {}
        })
    }

    const injectViewSavedPost = (retryCount = 5, delay = 500) => {

        const navItems  =   document.querySelectorAll('.entity-list-wrapper .entity-list');

        if (navItems.length > 0) {
            navItems.forEach((menuItem) => {
                if (!menuItem.querySelector('.j-list-button-wrapper')) {
                    const option = document.createElement("div");
                    option.className = `j-list-button-wrapper`;
                    menuItem.prepend(option);
                    const root = createRoot(option); 
                    root.render(<BookmarkListButton onButtonClick={() => handleListClick()} applyPadding={menuItem.closest('.feed-identity-module__widgets')}/>);
                }
            })
        }else if (retryCount > 0) {
            setTimeout(() => injectViewSavedPost(retryCount - 1, delay), delay);
        } else {
            console.warn("Failed to inject view saved post: navItems not found.");
        }
    }

    useEffect(() => {
        injectViewSavedPost()
    }, [])

    const onClose = () => {
        setVisible(false);
        setInitialValue(null);
        setShowNoPost(false);
    };

    const getContainer = () => {
        if(showNoPost){
            return <NotPostPage handleClose={onClose}/>
        }else{
            return <PostForm loading={loading} initialValue={initialValue} posts={posts} handleClose={onClose}/>
        }
    }

    const getPage = () => {
        if(showShareOn){
            return (
                <ShareOnLinkedin posts={posts} handleOnComplete={() => setShowShareOn(false)}/>
            )
        }else{
            return (
                <div className="bs-height100">
                        <div className="j-post-drawer-header">
                            <img alt="Logo" className="j-logo" src="https://static.buyerstage.io/static-assets/buyerstage-logo.svg" />
                            <Space size={15}>
                                {
                                    !showNoPost &&
                                        <Button onClick={handleListClick} >
                                            Saved Posts
                                        </Button>
                                }
                                <div className="j-icon-round-wrapper">
                                    <MdClose className="bs-cursor-pointer" size={20} color="#7A7E82" onClick={() => onClose()} fontWeight={300}/>
                                </div>
                            </Space>
                        </div>
                    <div className="j-post-body">{ getContainer() }</div>
                </div>
            )
        }
    }

    const handleOpenSlider = () => {
        if(page === POST_PAGE){
            setVisible(true)
            setLoading(false)
            const initial = buildInitialValueFromCurrentPage();
            setInitialValue(initial)
        }else{
            setShowNoPost(true)
            setVisible(true)
        }
    }

    if(page === OPTIONS_PAGE){
        return <OptionsContainer/>
    }else{
        return (
            <div className="bs-root-container">
                <Drawer 
                    onClose                 =   {onClose} 
                    open                    =   {visible} 
                    rootClassName           =   "j-post-drawer-root"
                    className               =   "j-post-drawer-wrapper bs-font-light bs-zindex"
                    width                   =   {400}
                    mask                    =   {false}
                    push                    =   {{ distance: 0 }} 
                    styles                  =   {{header: {display: "none"}}}
                    destroyOnClose 
                >
                    {
                        isOnboarded ?
                            getPage()
                        :
                            <GetEmail handleOnComplete={() => setIsOnboarded(true)}/>
                    }
                </Drawer>
                { !visible && <Avatar sty shape='circle' onClick={() => handleOpenSlider()} size={50} className="j-avatar-logo" src= "https://static.buyerstage.io/static-assets/buyerstage-product-logo.svg" />}
            </div>
        )
    }
}

export default Layout;