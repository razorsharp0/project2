import React, { useState } from 'react';
import { TextField, Button, Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Auth({ mode = 'login', onAuth }) {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState(mode);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`/api/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      if (data.token) localStorage.setItem('token', data.token); // Store JWT token
      onAuth && onAuth(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, boxShadow: 2, borderRadius: 2 }}>
      <ToggleButtonGroup
        value={authMode}
        exclusive
        onChange={(_, v) => v && setAuthMode(v)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="login">{t('login')}</ToggleButton>
        <ToggleButton value="register">{t('register')}</ToggleButton>
      </ToggleButtonGroup>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label={t('login') + ' ' + t('username')}
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label={t('login') + ' ' + t('password')}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {authMode === 'register' && (
          <TextField
            label={t('role')}
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          {t(authMode)}
        </Button>
      </Box>
      <Button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')} sx={{ mt: 2 }}>
        {i18n.language === 'en' ? 'العربية' : 'English'}
      </Button>
    </Box>
  );
} 