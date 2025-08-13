import { createContext, useEffect, useState } from 'react';
import OptionsLayout from './index.tsx';

import { AppBroker } from '../query/AppBroker';
import { getPostsArray } from './options-transformer.ts';
import { Post } from '../helper/types.ts';
import { transformPosts } from '../helper/post-transformer.ts';

interface OptionsContextType {
    $posts          :   Post[],
    $collections    :   string[],
    deletePost      :   (postId: string) => void
    setCollections  :   (collections: string[]) => void
    loading         :   boolean,
    userInfo        :   any
}

export const OptionsContext = createContext<OptionsContextType>({
    $posts          :   [],
    $collections    :   [],
    deletePost      :   () => {},
    setCollections  :   ([]) => {},
    loading         :   true,
    userInfo        :   {}
});

const OptionsContainer = () => {

    const [loading, setLoading]         =   useState<boolean>(true);
    const [posts, setPosts]             =   useState<Post[]>([]);
    const [collections, setCollections] =   useState<string[]>([]);
    const [userInfo, setUserInfo]       =   useState<any>({});



    useEffect(() => {
        // No external API; rely only on chrome.storage
        AppBroker.getPosts({
            onSuccess: (data: any) => {
                const postsArray: any = getPostsArray(data)
                setPosts(postsArray)
            }
        })
    }, [])


    useEffect(() => {
        setLoading(true)

        AppBroker.getPosts({
            onSuccess: (data: any) => {
                const postsArray: any = getPostsArray(data)
                setPosts(postsArray)
                setLoading(false)
            }
        })

        AppBroker.getCollections({
            onSuccess: (data: any) => {
                setCollections((prevCollections): any => [...prevCollections, ...data])
            }
        })

        AppBroker.getUserInfo({
            onSuccess: (data: any) => {
                setUserInfo(data)
            }
        })

    }, []);

    const handleDelete = (postId: string) => {
        setPosts((prevPosts: Post[]) => prevPosts?.filter((_post) => _post.id !== postId))
    }

    const $context = {
        $posts          :   posts || [],
        $collections    :   collections,
        setCollections  :   setCollections,
        deletePost      :   handleDelete,
        loading         :   loading,
        userInfo        :   userInfo
    };

    return (
        <OptionsContext.Provider value={{...$context}}>
            <OptionsLayout/>
        </OptionsContext.Provider>
    )
}

export default OptionsContainer