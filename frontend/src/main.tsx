import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Router from './router';

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<>
			<Router />
			<ToastContainer
				theme='dark'
				autoClose={4000}
				position="bottom-center"
				stacked
			/>
		</>
	</React.StrictMode>,
)
