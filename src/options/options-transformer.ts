export function getPostsArray(postsObj: any) {
    let posts: any[] = [];
    Object.entries(postsObj).forEach(([id, data]: [string, any]) => {
        posts.push({ id, ...data });
    });

    // Sort posts by `createdOn` in descending order
    posts.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());

    return posts;
}
