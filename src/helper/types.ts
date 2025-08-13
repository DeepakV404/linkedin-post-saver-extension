export interface Post{
    id          :   string,
    title       :   string,
    url         :   string,
    tags        :   string[] | [],
    collection  :   string,
    note?       :   string | null,
    content?    :   string,
    imageUrl?   :   string | null,
    postBy?     :   string | null
    createdOn   :   number,
    userInfo?   :   {
        userName?   :   string,
        userAvatar? :   string
     },
    user?       :   {
        name?       :   string,
        avatar?     :   string
    }
}

export interface TagItem{
    tag_id          :   string,
    title           :   string,
    primary_color   :   string,
    secondary_color :   string,
}