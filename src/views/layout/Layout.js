import { useEffect, useState } from "react";
import { Avatar, Button, Drawer, Space, Tooltip } from "antd";
import { MdClose, MdOpenInBrowser, MdOutlineMenu } from "react-icons/md";
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
        const permalink = DataScrapper.getPermalinkForCurrentPage();
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
                postUrl: permalink,
            },
        };
    };

    const buildInitialValueFromElement = (element, postId) => {
        const meta = DataScrapper.getPostMetaFromElement(element);
        const permalink = DataScrapper.getPermalinkFromElement(element);
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
                postUrl: permalink,
            },
        };
    };
    
    // Helpers for feed detection and injection
    const isActivityElement = (el) => {
        if(!(el && el.getAttribute)) return false;
        const dataId = el.getAttribute('data-id') || '';
        const dataUrn = el.getAttribute('data-urn') || '';
        const classMatch = (el.matches && el.matches('.feed-shared-update-v2, .occludable-update, article')) || false;
        return (
            dataId.startsWith('urn:li:activity:') ||
            (dataId.startsWith('urn:li:aggregate:') && dataId.includes('urn:li:activity:')) ||
            dataUrn.includes('urn:li:activity:') ||
            (classMatch && (dataUrn.includes('urn:li:activity:') || dataId.includes('urn:li:activity:')))
        );
    };

    const findPostElementsWithin = (root) => {
        let posts = [];
        const isElem = root instanceof Element;
        const queryRoot = (root && typeof root.querySelectorAll === 'function') ? root : (document.body || document);
        if(isElem && isActivityElement(root)){
            posts.push(root);
        }
        posts = posts.concat(Array.from(queryRoot.querySelectorAll('[data-id^="urn:li:activity:"]')));
        const aggregates = Array.from(queryRoot.querySelectorAll('[data-id^="urn:li:aggregate:"]'))
            .filter(el => (el.getAttribute('data-id') || '').includes('urn:li:activity:'));
        posts = posts.concat(aggregates);
        // Also include any element that carries data-urn with activity
        const urnCarriers = Array.from(queryRoot.querySelectorAll('[data-urn*="urn:li:activity:"]'));
        posts = posts.concat(urnCarriers);
        // And common post containers that might miss attributes at first
        posts = posts.concat(Array.from(queryRoot.querySelectorAll('.feed-shared-update-v2, .occludable-update, article[data-urn*="urn:li:activity:"]')));
        return posts;
    };

    const getPostRootFromNode = (node) => {
        if(!(node instanceof Element)) return null;
        if(isActivityElement(node)) return node;
        const idAncestor = node.closest('[data-id^="urn:li:activity:"],[data-id^="urn:li:aggregate:"]');
        if(idAncestor) return idAncestor;
        const urnAncestor = node.closest('[data-urn*="urn:li:activity:"]');
        return urnAncestor || null;
    };

    const markInjected = (container) => {
        container.setAttribute('data-pp-injected', '1');
    };

    const isInjected = (container) => container.getAttribute && container.getAttribute('data-pp-injected') === '1';

    const actorContainerSelectors = [
        '.update-components-actor__container',
        '.feed-shared-update-v2__actor',
        '.update-components-header',
        'header.update-components-actor'
    ];

    const selectActorContainer = (root) => {
        for(const sel of actorContainerSelectors){
            const el = root.querySelector(sel);
            if(el) return el;
        }
        return null;
    };

    const injectForPostElement = (postElement) => {
        // Normalize to the recognized post root
        const root = getPostRootFromNode(postElement) || postElement;
        const dataId = root.getAttribute('data-id') || '';
        const dataUrn = root.getAttribute('data-urn') || '';
        let postId = '';
        if(dataId){
            postId = (dataId.split(':').pop()) || '';
        }
        if(!postId && dataUrn){
            const m = dataUrn.match(/urn:li:activity:(\d+)/);
            if(m) postId = m[1];
        }
        // Try multiple variants of the actor container across LinkedIn layouts
        const actorContainer = selectActorContainer(root);
        if(!actorContainer) return false;

        // Cleanup: remove any stray buttons in the post root that are not inside the canonical actor container
        const strayButtons = Array.from(root.querySelectorAll('.j-bookmark-button'));
        strayButtons.forEach((btn) => {
            if(!actorContainer.contains(btn)){
                btn.remove();
            }
        });

        if(isInjected(actorContainer) || actorContainer.querySelector('.j-bookmark-button')) {
            // Ensure we mark as injected to prevent future attempts
            markInjected(actorContainer);
            return false;
        }

        const button = createSavePostDiv();
        button.addEventListener('click', () => {
            setVisible(true);
            setLoading(false);
            const initial = buildInitialValueFromElement(root, postId);
            setInitialValue(initial);
        });
        actorContainer.appendChild(button);
        markInjected(actorContainer);
        return true;
    };

    const injectSavePostButtons = () => {
        if(page === POST_PAGE){
            // Inject once on post page
            const actorContainers = document.querySelectorAll('.update-components-actor__container');
            actorContainers.forEach((container) => {
                if(isInjected(container) || container.querySelector('.j-bookmark-button')) return;
                const button = createSavePostDiv();
                button.addEventListener('click', () => {
                    setVisible(true);
                    setLoading(false);
                    const initial = buildInitialValueFromCurrentPage();
                    setInitialValue(initial);
                });
                container.appendChild(button);
                markInjected(container);
            });
            return;
        }

        // Initial sweep for feed page
        const posts = findPostElementsWithin(document.body || document);
        posts.forEach(injectForPostElement);
    };

    const attemptInitialInjection = (attempts = 15, delay = 250) => {
        let injected = 0;
        const posts = findPostElementsWithin(document.body || document);
        posts.forEach((p) => { if(injectForPostElement(p)) injected++; });
        if(injected > 0 || attempts <= 0) return;
        setTimeout(() => attemptInitialInjection(attempts - 1, delay), delay);
    };

    useEffect(() => {
        if(page === OPTIONS_PAGE){
            return;
        }

        // Initial injection with retries to handle slow DOM paint
        attemptInitialInjection();

        if(page === POST_PAGE){
            // Post pages are static enough; no observer needed
            return;
        }

        // Feed pages: observe and process only added nodes, debounced
        let pending = new Set();
        let timer = null;

        const schedule = () => {
            if(timer) return;
            timer = setTimeout(() => {
                const toProcess = Array.from(pending);
                pending.clear();
                timer = null;
                toProcess.forEach((node) => {
                    const posts = findPostElementsWithin(node);
                    posts.forEach(injectForPostElement);
                });
            }, 120);
        };

        const observer = new MutationObserver((mutations) => {
            for(const m of mutations){
                m.addedNodes && m.addedNodes.forEach((node) => {
                    if(node.nodeType === 1){
                        pending.add(node);
                        // If the added node is the actor container, queue its closest post root
                        if(node instanceof Element && node.matches && node.matches('.update-components-actor__container')){
                            const root = getPostRootFromNode(node);
                            if(root) pending.add(root);
                        }
                    }
                });
            }
            schedule();
        });

        const feedRoot = document.querySelector('.scaffold-finite-scroll__content') || document.querySelector('.feed-outlet') || document.querySelector('[role="main"]') || document.body;
        observer.observe(feedRoot, { childList: true, subtree: true });

        // Observe body as a safety net to catch feed root replacements (e.g., "See new posts")
        const globalObserver = new MutationObserver((mutations) => {
            let rootChanged = false;
            for(const m of mutations){
                m.addedNodes && m.addedNodes.forEach((node) => {
                    if(node.nodeType === 1){
                        // If a new feed container appears, queue it
                        if(node instanceof Element && (node.matches('.scaffold-finite-scroll__content, .feed-outlet, [role="main"]') || node.hasAttribute('data-urn'))){
                            pending.add(node);
                            rootChanged = true;
                        }
                    }
                });
            }
            if(rootChanged) schedule();
        });
        globalObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            globalObserver.disconnect();
            if(timer){
                clearTimeout(timer);
                timer = null;
            }
            pending.clear();
        };

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
                { !visible && <Avatar sty shape='circle' onClick={() => handleOpenSlider()} size={50} className="j-avatar-logo" ><MdOpenInBrowser/></Avatar>}
            </div>
        )
    }
}

export default Layout;