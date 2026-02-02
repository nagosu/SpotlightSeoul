import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useAuthStore } from './stores/useAuthStore';

// 새로고침 이후에도 인증 상태를 복원합니다.
useAuthStore.getState().initialize();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
