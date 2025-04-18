import { Button, Form, Input, Space } from "antd";
import { AppBroker } from "../../query/AppBroker";
import emailjs from '@emailjs/browser';
import { useEffect, useState } from "react";

const { useForm }   =   Form;

const GetEmail = (props: { handleOnComplete: () => void }) => {

    const { handleOnComplete }  =   props;

    const [form]    =   useForm();

    const [userInfo, setUserInfo]       =   useState<any>({});
    const [loading, setLoading]         =   useState<boolean>(false);

    useEffect(() => {
        AppBroker.getUserInfo({
            onSuccess: (data: any) => {
                setUserInfo(data)
            }
        })
    }, [])

    const onFinish = (values: {emailId: string}) => {
        setLoading(true)
        const templateParams = {
            from_name   :   'Buyerstage Extension',
            emailId     :   values.emailId,
            slug        :   userInfo.slug ?? "",
            url         :   userInfo.linkedInUrl ?? "",
        };

        AppBroker.setOnboardingInfo({
            onboardingInfo: {
                isOnboarded: true,
                email: values.emailId
            },
            onSuccess: () => {
                setLoading(false)
                handleOnComplete()
                emailjs.send(process.env.REACT_APP_EMAIL_JS_SERVICE_KEY!, process.env.REACT_APP_EMAIL_USER_TEMPLATE_ID!, templateParams, {
                    publicKey: process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY,
                })
                    .then((response) => {
                        console.log('Email sent successfully!', response);
                    }, (error) => {
                        console.error('Failed to send email:', error);
                    });
            }
        })
    }

    const onSkipSendEmail = () => {
        const templateParams = {
            from_name   :   'Buyerstage Extension',
            emailId     :   "",
            slug        :   userInfo.slug ?? "",
            url         :   userInfo.linkedInUrl ?? "",
        };
        
        emailjs.send(process.env.REACT_APP_EMAIL_JS_SERVICE_KEY!, process.env.REACT_APP_EMAIL_USER_TEMPLATE_ID!, templateParams, {
            publicKey: process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY,
        })
        .then(() => {
            console.log("Email sent")   
        });

    }

    const handleSkip = () => {
        AppBroker.setOnboardingInfo({
            onboardingInfo: {
                isOnboarded: true,
                skippedEmail: true
            },
            onSuccess: () => {
                if(userInfo){
                    onSkipSendEmail()
                }
                handleOnComplete()
            }
        })
    }

    return (
        <div className="bs-height100">
            <Space className="j-bs-drawer-email-top bs-width100 bs-flex-center" direction="vertical" size={30}>
                <img alt="Buyerstage" src="https://static.buyerstage.io/static-assets/buyerstage-logo.svg" style={{width: "160px"}}/>
                <img alt="Save and Organize" src="https://static.buyerstage.io/bs_extension/bs_e_image1.svg"/>
                <div style={{width: "300px"}} className="bs-font-size20 bs-font-fam500 bs-text-center">Save & organize your favorite posts in two click</div>
            </Space>
            <Space className="j-bs-drawer-email-bottom bs-width100 bs-flex-center" direction="vertical" size={20}>
                <div className="bs-font-fam500 bs-label-text">Enter your email to get started</div>
                <Form form={form} onFinish={onFinish} layout={"vertical"} style={{width: "350px"}}>
                    <Form.Item name={"emailId"} className="j-email-input-box" rules={[{required: true, message: "Email is required"}]}>
                        <Input size='large' style={{height: "38px", textAlign: "center"}} placeholder="example@mail.com"/>
                    </Form.Item>
                    
                    <Form.Item>
                        <Button loading={loading} disabled={loading} htmlType='submit' type='primary' size='large' block className='j-bookmark-save-btn'>Submit</Button>
                    </Form.Item>
                </Form>
                <div className="bs-font-size13 bs-font-fam500 bs-label-text bs-cursor-pointer" onClick={handleSkip}>or Skip & Continue</div>
            </Space>
        </div>
    )
}

export default GetEmail