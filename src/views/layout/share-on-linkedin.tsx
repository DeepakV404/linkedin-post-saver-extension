import { Button, Divider, Space } from "antd";

import { AppBroker } from "../../query/AppBroker";
import { Post } from "../../helper/types";

const ShareOnLinkedin = (props: {posts: Post[], handleOnComplete: () => void}) => {

    const { posts, handleOnComplete }  =   props;

    const poppers_svg       =   "https://static.buyerstage.io/bs_extension/poppers.svg";
    const share_post_url    =   "http://www.linkedin.com/shareArticle?mini=true&url=https://www.buyerstage.io/free-tools/linkedin-save-post"
    const review_url        =   "https://chromewebstore.google.com/detail/Buyerstage/afkdgeafbledfcnlpkgomgafiheimodb/reviews";

    const handleSkip = () => {
        AppBroker.setMarketingInfo({
            marketingInfo: {
                sharedOnLinkedIn: "later"
            },
            onSuccess: () => {
                handleOnComplete()
            }
        })
    }

    const handleShareNow = () => {
        AppBroker.setMarketingInfo({
            marketingInfo: {
                sharedOnLinkedIn: true
            },
            onSuccess: () => {
                handleOnComplete()
                window.open(`https://www.linkedin.com/posts/inhandin_organize-your-saved-linkedin-posts-free-activity-7271805864217317376-hl84`)
            }
        })
    }


    const handleShareOnLinkedIn = () => {
        AppBroker.setMarketingInfo({
            marketingInfo: {
                sharedOnLinkedIn: true
            },
            onSuccess: () => {
                handleOnComplete()
                window.open(share_post_url, "_blank")
            }
        })
    }

    return (
        <div className="bs-height100 bs-flex-center" style={{flexDirection: "column", rowGap: "50px"}}>
            <div className="j-bs-drawer-email-top bs-width100" style={{position: "absolute", top: "0px", left: "0px"}}></div>
            <Space className="bs-width100 bs-flex-center" direction="vertical" size={30} style={{zIndex: 999}}>
                <Space className="bs-width100 bs-flex-center" direction="vertical" size={30}>
                    <img alt="Buyerstage" src="https://static.buyerstage.io/static-assets/buyerstage-logo.svg" style={{width: "160px"}}/>
                    <div style={{position: "relative"}}>
                        <img style={{width: "300px"}} alt="Share on LinkedIn" src={poppers_svg}/>
                        <div className="bs-flex-center" style={{flexDirection: "column", position: "absolute", textAlign: "center", width: "200px", top: "80px", left: "55px"}}>
                            <div style={{fontSize: "18px", color: "#00066A", lineHeight: "28px"}} className="bs-font-fam600">Hurray!</div>
                            <div style={{fontSize: "18px", color: "#00066A", lineHeight: "28px"}} className="bs-font-fam600">{posts.length ? `You saved ${posts.length} posts` : `You've successfully saved posts`} </div>
                        </div>
                    </div>
                    <Divider style={{margin: "0px", width: "180px"}}/>
                </Space>
                <Space style={{width: "230px"}} direction="vertical" size={15}>
                    <div className="bs-font-size20 bs-font-fam500 bs-text-center">Now, Time to Show Some <span style={{color: "#FF0369"}}>Love</span> on LinkedIn</div>
                    <div className="bs-font-size14 bs-text-center bs-black-67">Comment your feedback or requirements in our discussion thread!</div>
                </Space>
            </Space>
            <Space direction="vertical" className="bs-flex-center" size={20}>
                <Button htmlType='submit' type='primary' size='large' style={{width: "155px"}} onClick={handleShareNow}>Go To Thread</Button>
                <Space>
                    <a className="bs-black87 bs-font-fam400 bs-label-text bs-cursor-pointer bs-hover-underline" href={review_url} target="_blank">Write a review</a>
                    <Divider type="vertical"/>
                    <div className="bs-black87 bs-label-text bs-cursor-pointer bs-hover-underline" onClick={handleShareOnLinkedIn}>Share</div>
                    <Divider type="vertical"/>
                    <div className="bs-font-size13 bs-label-text bs-cursor-pointer bs-hover-underline" onClick={handleSkip}>Skip</div>
                </Space>
            </Space>
        </div>
    )
}

export default ShareOnLinkedin