import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function ReportItem({ user }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', description: '', status: 'lost', date: '', owner: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(form),
    });
    if (res.ok) setMsg('Item reported!');
    else setMsg('Error reporting item');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6">{t('report')}</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField label={t('name')} name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label={t('description')} name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
        <TextField select label={t('status')} name="status" value={form.status} onChange={handleChange} fullWidth margin="normal">
          <MenuItem value="lost">{t('lost')}</MenuItem>
          <MenuItem value="found">{t('found')}</MenuItem>
        </TextField>
        <TextField label={t('date')} name="date" type="date" value={form.date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <TextField label={t('owner')} name="owner" value={form.owner} onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>{t('report')}</Button>
      </Box>
      {msg && <Typography sx={{ mt: 2 }}>{msg}</Typography>}
      <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>{t('back') || 'Back'}</Button>
    </Box>
  );
} 