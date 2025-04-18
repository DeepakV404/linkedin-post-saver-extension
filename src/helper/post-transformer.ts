import { Post } from "./types";

export function transformPosts(pData: any[]): Post[] {
    return pData.map((item) => {
        const transformedPost: Post = {
            id: item.post_id,
            title: item.note || null,
            url: item.post_url,
            tags: item.tags || [],
            collection: "default",
            note: item.note || null,
            content: item.content || null,
            imageUrl: item.content_url || null,
            postBy: null,
            createdOn: Date.now(),
            userInfo: {
                userName: item.username,
                userAvatar: item.useravatar,
            },
        };
        return transformedPost;
    });
    
}