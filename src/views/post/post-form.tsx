import { useEffect, useState } from 'react';
import { Button, Carousel, Form, Input, Select, Space, Typography } from 'antd';
import { MdDone } from "react-icons/md";

import { getPostsArray } from '../../options/options-transformer';
import { AppBroker } from '../../query/AppBroker';
import { PostMeta } from '../../helper/helper';
import PostLoading from './post-loading';
import emailjs from '@emailjs/browser';
import { TagItem } from '../../helper/types';

const { Text, Paragraph }   =   Typography;
const { TextArea }          =   Input;
const { Option }            =   Select;
const { useForm }           =   Form;


const PostForm = (props: {loading: boolean, initialValue: any, handleClose: () => void}) => {

    const { loading, initialValue, handleClose }   =   props;

    const [form]    =   useForm();

    const [posts, setPosts]             =   useState<any>([]);
    const [postData, setPostData]       =   useState<PostMeta | null>(null); 
    const [saveState, setSaveState]     =   useState<boolean | "saved">(false);
    const [tags, setTags]               =   useState([]);
    const [collections, setCollections] =   useState([]);
    const [userInfo, setUserInfo]       =   useState<any>({});

    useEffect(() => {
        AppBroker.getUserInfo({
            onSuccess: (data: any) => {
                setUserInfo(data)
            }
        })
    }, [])

    useEffect(() => {
        AppBroker.getPosts({
            onSuccess: (data: any) => {
                setPosts(getPostsArray(data))
            }
        })
    }, [])

    useEffect(() => {
        if(initialValue){
            setPostData(initialValue)
        }
    }, [initialValue])

    useEffect(() => {
        if(postData?.postMeta.postUrl){
            form.setFieldsValue({
                url : postData?.postMeta.postUrl
            })
        }
    }, [postData])

    useEffect(() => {

        AppBroker.getCollections({
            onSuccess: (data: any) => {
                setCollections((prevCollections): any => [...prevCollections, ...data])
            }
        })

        AppBroker.getTags({
            onSuccess: (data: any) => {
                setTags((prevTags): any => [...prevTags, ...data])
            }
        })


        AppBroker.executeApi({
            query: "tags",
            request: {
                method      :   'GET',
                headers     :   {'Content-Type': 'application/json'}
            },
            onSuccess: (data: any) => {
                console.log("data: in ",data)
                setTags((prevTags): any => [...prevTags, ...data])
            },
            onFailure: () => {

            }
        })

    }, [])

    const onFinish = (values: any) => {
        setSaveState(true)

        AppBroker.executeApi({
            query: "posts",
            request: {
                body        :  {
                    "postUrl"       :   postData?.postMeta.postUrl,
                    "note"          :   values.notes,
                    "contentUrl"    :   postData?.postMeta.postThumbnailUrl,
                    "tags"          :   values.tags,
                    "content"       :   postData?.postMeta.postContent,
                    "userName"      :   postData?.userInfo.userName,
                    "userAvatar"    :   postData?.userInfo.userAvatar
                },
                method      :   'POST',
                headers     :   {'Content-Type': 'application/json'}
            },
            onSuccess: (data: any) => {
                console.log("data: in Form",data)
                handleClose()
            },
            onFailure: () => {

            }
        })
        // AppBroker.createPost({
        //     post: {
        //         id              :   postData?.postMeta.postId.uniqueId,
        //         postId          :   postData?.postMeta.postId.postUniqueId,
        //         imageUrl        :   postData?.postMeta.postThumbnailUrl,
        //         content         :   postData?.postMeta.postContent,
        //         url             :   postData?.postMeta.postUrl,
        //         tags            :   values.tags,
        //         note            :   values.notes,
        //         collection      :   values.collection,
        //         userName        :   postData?.userInfo.userName,
        //         userAvatar      :   postData?.userInfo.userAvatar,
        //     },
        //     onSuccess: () => {
        //         setSaveState("saved")
        //         setTimeout(() => {
        //             setSaveState(false)
        //             handleClose()
        //         }, 2000)
        //     }
        // })
    }

    const openSales = () => {
        const emailTemplateParams = {
            from_name   :   'Buyerstage Extension',
            subject     :   'New visit to DSR via Extension CTA',
            slug        :   userInfo.slug,
            url         :   userInfo.linkedInUrl,
            cta         :   "Sales"
        };
        
        emailjs.send(process.env.REACT_APP_EMAIL_JS_SERVICE_KEY!, process.env.REACT_APP_EMAIL_CTA_TEMPLATE_ID!, emailTemplateParams, {
            publicKey: process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY,
        })
        .then(() => {
            console.log("Email sent")   
        });

        window.open(`https://www.buyerstage.io?ref=bs_extension&profile=${userInfo.slug}`, "_blank")
    }

    const openMarketing = () => {
        const emailTemplateParams = {
            from_name   :   'Buyerstage Extension',
            subject     :   'New visit to DPR via Extension CTA',
            slug        :   userInfo.slug,
            url         :   userInfo.linkedInUrl,
            cta         :   "Marketing"
        };
        
        emailjs.send(process.env.REACT_APP_EMAIL_JS_SERVICE_KEY!, process.env.REACT_APP_EMAIL_CTA_TEMPLATE_ID!, emailTemplateParams, {
            publicKey: process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY,
        })
        .then(() => {
            console.log("Email sent")
        });

        window.open(`https://www.buyerstage.io/product/collateral-management?ref=bs_extension&profile=${userInfo.slug}`, "_blank")
    }

    return (
        <>
            <div className='bs-padding-20 bs-height100'>
                {
                    loading ? 
                            <PostLoading/>
                        : 
                            <div style={{display: "flex", columnGap: "10px"}} className='j-post-card'>
                                {
                                    postData?.postMeta.postThumbnailUrl ?
                                        <img alt='Post' src={postData?.postMeta.postThumbnailUrl} style={{width: "100px", height: "125px", objectFit: "cover", borderRadius: "6px"}}/>
                                    :
                                        null
                                }
                                <Space direction='vertical'>
                                    <Text className='j-post-title'>{postData?.userInfo.userName ? postData?.userInfo.userName : "unknown"}</Text>
                                    <Paragraph className='bs-margin-0' ellipsis={{rows: 4}}>{postData?.postMeta.postContent}</Paragraph>
                                </Space>
                            </div>
                }
                <Form disabled={loading} form={form} onFinish={onFinish} layout={"vertical"} className='j-bookmark-form bs-margin-top-15'>
                    <Space direction='vertical' className='bs-width100 bs-height100' style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <Space direction='vertical' className='bs-width100' size={0}>
                            <Form.Item name={"notes"} label={<div className='bs-label-text'>Notes</div>}>
                                <TextArea autoSize={{ minRows: 3, maxRows: 5 }} size='large' placeholder='Add notes...'/>
                            </Form.Item>

                            <Form.Item name={"tags"} label={<div className='bs-label-text'>Tags</div>} >
                                <Select size='large' placeholder={"Add Tags..."} removeIcon={true} mode="tags">
                                    {
                                        tags.map((_tag: TagItem) => (
                                            <Option key={_tag.tag_id}>{_tag.title}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item name={"collection"} label={<div className='bs-label-text'>Collections</div>} >
                                <Select size='large' placeholder={"Select a Collection"} removeIcon={true} showSearch>
                                    {
                                        collections.map((_collection) => (
                                            <Option key={_collection}>{_collection}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item name={"url"} label={<div className='bs-label-text'>URL</div>} initialValue={postData?.postMeta.postUrl} hidden>
                                <Input size='large' style={{height: "38px", color: "#000"}} disabled={true}/>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType='submit' type='primary' size='large' block className='j-bookmark-save-btn' loading={saveState === true}>
                                    <div className='bs-flex-align-center' style={{columnGap: "8px"}}>
                                        {saveState === "saved" ? <MdDone size={18}/> : null}
                                        {saveState === true ? "Saving..." : saveState === "saved" ? "Saved successfully" : "Save"}
                                    </div>
                                </Button>
                            </Form.Item>
                        </Space>
                        {
                            posts.length >= 10 ?
                                <Carousel autoplay className="bs-width100 bs-margin-top-15">
                                    <img src="https://static.buyerstage.io/bs_extension/dsr_ad.svg" className='bs-cursor-pointer' onClick={() => openSales()}/>
                                    <img width={"100%"} height={"100%"} src="https://static.buyerstage.io/bs_extension/dpr_ad.svg" className='bs-cursor-pointer' onClick={() => openMarketing()}/>
                                </Carousel>
                            :   
                                null
                        }
                    </Space>
                </Form>
            </div>
        </>
    )
}

export default PostForm