import React, {useState} from 'react';
import "antd/dist/antd.css";
import {createRoot} from 'react-dom/client';

import {MainLayout} from './components/index'
import {AppContext,Context} from './components/AppContext'

const root = createRoot(document.getElementById('root'));

// 装载
root.render(
    <AppContext>
        <MainLayout/>
    </AppContext>
);
// // 卸载
// root.unmount();
