import { Button, Divider, Space } from 'antd';
import { useEffect, useState } from 'react';
import { AppBroker } from '../../query/AppBroker';
import { getPostsArray } from '../../options/options-transformer';
import { MdOpenInNew } from 'react-icons/md';

const NotPostPage = (props: {handleClose: any}) => {

    const { handleClose }    =   props;

    const [collections, setCollections] =   useState<string[]>([]);

    const [posts, setPosts]             =   useState<any>([]);

    useEffect(() => {
        AppBroker.getPosts({
            onSuccess: (data: any) => {
                setPosts(getPostsArray(data))
            }
        })
    }, [])

    useEffect(() => {
        AppBroker.getCollections({
            onSuccess: (data: any) => {
                setCollections((prevCollections): any => [...prevCollections, ...data])
            }
        })
    }, []);

    const handleListClick = () => {
        AppBroker.openOptionsPage({
            onSuccess : () => {}
        })
    }

    return (
        <div className="bs-height100 bs-padding-20">
            <Space className="bs-width100" style={{height: "60%"}} direction="vertical" size={20}>
                <div className='j-total-post-card bs-flex-space-between bs-cursor-pointer hover-item' onClick={handleListClick}>
                    <Space>
                        <div className='bs-font-fam500 bs-black-67'>Total Saved Posts</div>
                        <MdOpenInNew size={14} color='#818181' className='show-on-hover-icon bs-cursor-pointer'/>
                    </Space>
                    <div className='bs-font-fam600 bs-font-size19'>{posts.length}</div>
                </div>
                <div className='j-total-collection-card'>
                    <div className='bs-font-fam500 bs-black-67' style={{padding: "10px 15px", borderBottom: "1px solid #ECF1F6"}}>Posts by Collections</div>
                    {
                        collections.length > 0 ? 
                            <div style={{maxHeight: "calc(100vh - 550px)", overflowY: "auto", paddingBlock: "10px"}}>
                                {
                                    collections.map((collection: string) => {
                                        const postsByCollectionCount = posts.filter((post: any) => post.collection === collection).length;
                                        return (
                                            <div className='bs-padding-inline15'>
                                                <div className='bs-flex-space-between'>
                                                    <div className='bs-font-size13 bs-black-67'>{collection}</div>
                                                    <div className='bs-font-fam500 bs-black-67'>{postsByCollectionCount}</div>
                                                </div>
                                                <Divider style={{ marginBlock: "10px", color: "#ECF1F6"}}/>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        :
                            <div style={{padding: "15px", color: "rgb(0 0 0 / 47%)", fontSize: "13px"}}>No posts by collections found</div>
                    }
                </div>
            </Space>
            <Space direction="vertical"  style={{height: "40%"}} className="bs-width100 bs-flex-center" size={20}>
                <div className="bs-font-size14 bs-text-center bs-black-67">Please click on the save post button to save your LinkedIn post</div>
                <Button htmlType='submit' onClick={handleClose} style={{border: "1px solid #7A7E82"}}>
                    <div className='bs-flex-center' style={{color: "#7A7E82"}}>
                        Save More Posts
                    </div>
                </Button>
            </Space>
        </div>
    )
}

export default NotPostPage