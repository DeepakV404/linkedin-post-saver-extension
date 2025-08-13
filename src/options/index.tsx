import { useContext, useEffect, useState } from 'react';
import { Button, Input, Space, Table, Tabs, Tag, Typography } from 'antd';
import { OptionsContext } from './options-container';
import { IoMdPricetag, IoIosSearch } from "react-icons/io";
import { MdOpenInNew } from "react-icons/md";
import { CgAddR } from "react-icons/cg";
import { CommonUtil } from '../utils/common-util';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AppBroker } from '../query/AppBroker';
import { Post } from '../helper/types';
import AddCollectionModal from '../views/collections/add-collection-modal';

const { TabPane }           =   Tabs;
const { Text, Paragraph }   =   Typography;

const OptionsLayout = () => {

    const { loading, $posts, $collections, deletePost, setCollections }   =   useContext(OptionsContext);

    const [search, setSearch]                       =   useState<string>("");
    const [filteredPosts, setFilteredPosts]         =   useState<Post[]>([]);
    const [createCollection, setCreateCollection]   =   useState<boolean>(false);
    const [selectedTab, setSelectedTab]             =   useState<string>('All Posts');

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
    
        const filteredList = $posts ? $posts?.filter((post: any) => {
            const matchesSearch = search
                ? search.startsWith("#")
                    ? post?.tags?.some((tag: string) => tag.toLowerCase().includes(lowerSearch))
                    : post?.content?.toLowerCase().includes(lowerSearch) ||
                      post?.userInfo?.userName?.toLowerCase().includes(lowerSearch) ||
                      post?.note?.toLowerCase().includes(lowerSearch) ||
                      post?.tags?.some((tag: string) => tag.toLowerCase().includes(lowerSearch)) ||
                      post?.collection?.toLowerCase().includes(lowerSearch)
                : true;
    
            const matchesTab = selectedTab === 'All Posts' || post?.collection === selectedTab;
    
            return matchesSearch && matchesTab;
        }) : [];
    
        setFilteredPosts(filteredList);
    }, [search, $posts, selectedTab]);
    

    const CollectionTabs = [
        {
            label   :   "All Posts",
            value   :   'All Posts',
        },
    ];
    
    $collections.map((_collection: string) => {
        CollectionTabs.push({
            label: _collection,
            value: _collection
        })
    })
    
    const renderers = {
        "_postDetails": (postData: Post) => {
            return(
                <div style={{display: "flex", columnGap: "10px"}}>
                    {
                        postData?.imageUrl ?
                            <img alt='Post' src={postData?.imageUrl} style={{width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px"}}/>
                        :
                            <img alt='Post' src={"https://static.buyerstage.io/bs_extension/post_thumbnail.svg"} style={{width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px"}}/>
                    }
                    <div style={{width: "calc(100% - 50px)"}}>
                        <Space className='bs-flex-align-center'>
                            <Text className='bs-black-87'>{postData?.userInfo?.userName? postData?.userInfo.userName : "Unknown"}</Text>
                            <MdOpenInNew size={16} color='#818181' className='show-on-hover-icon bs-cursor-pointer'/>
                        </Space>
                        <Text className='bs-font-size13 bs-black-67' style={{maxWidth: "100%"}} ellipsis>{postData?.content}</Text>
                    </div>
                </div>
            )
        },
        "_user": (record: Post) => {
            return (
                <Space className='bs-flex-align-center'>
                    {record?.user?.avatar ? <img alt='Avatar' src={record.user.avatar} style={{width: 24, height: 24, borderRadius: '50%'}}/> : null}
                    <span>{record?.user?.name || record?.userInfo?.userName || 'Unknown'}</span>
                </Space>
            )
        },
        "_notes": (record: Post) => {
            return(
                <Paragraph ellipsis={{rows: 3}} className='bs-margin-0 bs-black-87 bs-font-size13'>{record?.note ? record?.note : "-"}</Paragraph>
            )
        },
        "_collection": (record: Post) => {
            return(
                <Space size={1}>
                    {
                        record?.collection ?
                            <div>{record.collection}</div>
                        :
                            "-"
                    }
                </Space>
            )
        },
        "_tags": (record: Post) => {
            return(
                <Space size={1}>
                    {
                        record?.tags ?
                            record?.tags?.map((_tag: any) => {
                                console.log("_tag:",_tag)
                                return <Tag key={_tag.tag_id}>{_tag.title}</Tag>
                            })
                        :
                            "-"
                    }
                </Space>
            )
        },
        "_addedon": (record: Post) => {
            return(
                <div>{CommonUtil.__getDateDay(new Date(record?.createdOn))} {new Date(record?.createdOn).getFullYear()}, {CommonUtil.__format_AM_PM(record?.createdOn)}</div>
            )
        },
        "_actions": (record: Post) => {
            return(
                <RiDeleteBin6Line color='#5F6368' fontWeight={300} size={18} className='bs-cursor-pointer' onClick={(event) => {
                    event.stopPropagation();
                    AppBroker.deletePost({
                        post: record,
                        onSuccess: () => {
                            deletePost(record.id)
                        }
                    })
                }}/>
            )
        }
    };

    const columns: any = [
        {
            title       :   <div className='bs-font-fam500'>Post Details</div>,
            key         :   'postDetails',
            render      :   renderers._postDetails,
            width       :   '300px',
            fixed       :   "left"
        },
        {
            title       :   <div className='bs-font-fam500'>User</div>,
            key         :   'user',
            render      :   renderers._user,
            width       :   '200px',
        },
        {
            title       :    <div className='bs-font-fam500'>Notes</div>,
            key         :   'notes', 
            width       :   '250px',
            render      :   renderers._notes
        },
        {
            title       :   <div className='bs-font-fam500'>Collection</div>,
            key         :   'tags',
            render      :   renderers._collection,
            width       :   '200px',
            className   :   "j-tags-column"
        },
        {
            title       :   <div className='bs-font-fam500'>Tags</div>,
            key         :   'tags',
            render      :   renderers._tags,
            width       :   '200px',
            className   :   "j-tags-column"
        },
        {
            title       :   <div className='bs-font-fam500'>Added on</div>,
            key         :   'addedon',
            render      :   renderers._addedon,
            width       :   '150px',
        },
        {
            title       :   <div className='bs-font-fam500'>Actions</div>,
            key         :   'actions',
            render      :   renderers._actions,
            width       :   '100px',
        },
    ];

    const onTabChange = (key: string) => {
        setSelectedTab(key);
    };

    const onEdit = () => {
        setCreateCollection(true)
    };

    return (
        <>
            <div style={{height: "100vh"}}>
                <div className='j-bs-list-header bs-flex-align-center bs-flex-space-between'>
                    <img src='https://static.buyerstage.io/static-assets/buyerstage-white-logo.svg' width={160}/>
                    <div className='bs-flex-center bs-width100'>
                        <Input allowClear autoFocus className="j-post-search" onChange={(e) => setSearch(e.target.value)} placeholder='Search' prefix={<IoIosSearch size={18} color='#E8EAED'/>}/>
                    </div>
                </div>
                <div style={{backgroundColor: "#f5f7f9", height: "calc(100% - 90px)", padding: "0px 15px 15px 15px"}}>
                    <div className='j-bs-post-list-header bs-flex-space-between bs-flex-align-center'>
                        <Space direction='vertical' size={8}>
                            <div className='bs-font-size16 bs-font-fam600'>Posts ({filteredPosts?.length ? filteredPosts.length : 0})</div>
                            <div className='bs-secondary-text bs-font-size13'>Identify and access posts that you've saved directly from LinkedIn.</div>
                        </Space>
                        <Space className='j-bs-post-list-header-card bs-font-size14' size={15}>
                            <IoMdPricetag size={22} color="#F06422" style={{paddingTop: "2px"}}/>
                        </Space>
                    </div>
                    <div className='j-bs-post-list-body'>
                        <Tabs
                            className   =   "j-bs-post-list-tabs"
                            type        =   "editable-card"
                            onChange    =   {onTabChange}
                            activeKey   =   {selectedTab}
                            onEdit      =   {onEdit}
                            addIcon     =   {<CgAddR color='#5F6368' fontWeight={300} size={18}/>}
                        >
                            {CollectionTabs.map((tab) => (
                                <TabPane closable={false} tab={tab.label} key={tab.value} style={{background: "#f5f7f9"}}/>
                            ))}
                        </Tabs>
                        <Table 
                            bordered
                            size            =   'small'
                            className       =   'j-saved-post-list-table'
                            rowClassName    =   {"bs-cursor-pointer hover-item"}
                            scroll          =   {{y: (window.innerHeight - 235)}}
                            pagination      =   {false}
                            columns         =   {columns} 
                            dataSource      =   {filteredPosts.length ? filteredPosts : []}
                            locale          =   {{
                                emptyText   :   !loading ? 
                                                    <Space direction='vertical' className='j-empty-options-root bs-flex-center' size={15}>
                                                        <img alt='Post' src={"https://static.buyerstage.io/bs_extension/no_posts.svg"}/>
                                                        <div className='bs-font-size16 bs-font-fam600 bs-black-87'>No posts saved yet</div>
                                                        <div style={{width: "400px", textAlign: "center"}} className='bs-font-size13 bs-black-67'>Start saving your favorite posts and comments to see them here. Easily organize and access your saved content anytime.</div>
                                                        <Button style={{height: "42px"}} type='primary' onClick={() => window.open("https://www.linkedin.com/feed/", "_blank")}>Save Your First Post</Button>
                                                    </Space>
                                                :   <div>Loading...</div>
                            }}
                            onRow           =   {(record: any) => ({
                                onClick :   () => {
                                    if (record?.url) {
                                        window.open(record.url, "_blank");
                                    }
                                },
                            })}
                        />
                    </div>
                </div>
            </div>
            <AddCollectionModal
                isOpen      =   {createCollection}
                onClose     =   {() => setCreateCollection(false)}
                onCompleted =   {(collections) => setCollections(collections)}
            />
        </>
    )
}

export default OptionsLayout