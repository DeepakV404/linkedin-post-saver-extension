interface CommonUtilProps
{
    __format_AM_PM              :   (dateObject: Date | number) => string;
    __getDateDay                :   (dateObject: Date) => string;
}

export const CommonUtil =   {} as CommonUtilProps;

const Months: string[]  =   ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

CommonUtil.__format_AM_PM = (dateObject) => {
    let date: number            =   dateObject?.valueOf()
    let hours: string|number    =   new Date(date).getHours();
    let minutes: string|number  =   new Date(date).getMinutes();
    let am_pm: string           =   hours >= 12 ? 'PM' : 'AM';
    hours                       =   hours % 12;
    hours                       =   hours ? hours : 12;
    minutes                     =   minutes < 10 ? '0'+ minutes : minutes;
    let strTime: string         =   hours + ':' + minutes + ' ' + am_pm;

    return strTime;
}

CommonUtil.__getDateDay = (dateObject) => {
    let date: Date  =   new Date(dateObject.valueOf());

    return date.getDate() + " " + Months[date.getMonth()]
}