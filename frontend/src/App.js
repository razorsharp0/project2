import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation, I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import ReportItem from './components/ReportItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = (dir) => createTheme({
  direction: dir,
});

function AppContent() {
  const { i18n: i18, t } = useTranslation();
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.dir = i18.dir();
  }, [i18.language]);

  // Persist user after refresh
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    if (token && !user && userInfo) {
      setUser(JSON.parse(userInfo));
      // Redirect to correct dashboard
      const parsed = JSON.parse(userInfo);
      if (parsed.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme(i18.dir())}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            {t('welcome')}
          </Typography>
          {user && (
            <Typography sx={{ mr: 2 }}>
              {user.username} ({user.role})
            </Typography>
          )}
          <Button color="inherit" onClick={() => i18.changeLanguage(i18.language === 'en' ? 'ar' : 'en')}>
            {i18.language === 'en' ? 'العربية' : 'English'}
          </Button>
          {user && (
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
              {t('logout')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} /> : <Auth mode="login" onAuth={d => { setUser(d.user); localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user)); }} />} />
          <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} /> : <Auth mode="register" onAuth={d => { setUser(d.user); localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user)); }} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel user={user} /> : <Navigate to="/login" />} />
          <Route path="/items" element={user && user.role === 'admin' ? <ReportItem user={user} /> : <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <CacheProvider value={cacheRtl}>
        <Router>
          <AppContent />
        </Router>
      </CacheProvider>
    </I18nextProvider>
  );
}

export default App;
