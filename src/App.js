import './bs.css';
import './options.css';
import './humbird-font.css';
import { ConfigProvider } from 'antd';

import Layout from './views/layout/Layout';

export const OPTIONS_PAGE = "OPTIONS_PAGE";

function App() {
    
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#F48125',
                    fontSizeLG: "14px"
                }
            }}
        >
            <Layout />
        </ConfigProvider>
    );
}

export default App;
