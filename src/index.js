import React from 'react';
import { createRoot } from 'react-dom/client';
import $ from "jquery";

import App from './App';

const body  =   document.querySelector('body')
const app   =   document.createElement('div')
app.id      =   'bs-root';


if($('#bs-root').length === 0 && body)
{
    body.prepend(app)
    const root = createRoot(document.getElementById('bs-root'));
    root.render(<App />)
}
