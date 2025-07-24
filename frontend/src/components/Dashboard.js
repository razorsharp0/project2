import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Snackbar, Alert, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const navigate = useNavigate();

  const fetchItems = () => {
    const token = localStorage.getItem('token');
    fetch('/api/items', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleClaim = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/items/${id}/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSuccess('Item claimed successfully!');
      fetchItems();
    } else {
      const data = await res.json();
      setError(data.message || 'Error claiming item');
    }
  };

  const claimable = items.filter(item => item.status !== 'claimed');
  const claimed = items.filter(item => item.status === 'claimed');

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>{t('welcome')}, {user.username}</Typography>
      {user.role === 'admin' && (
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate('/items')}>
          {t('report')}
        </Button>
      )}
      <Typography variant="h6" sx={{ mt: 3 }}>{t('found')} / {t('lost')} {t('items')}</Typography>
      <List>
        {claimable.map(item => (
          <ListItem key={item.id} secondaryAction={
            user.role !== 'admin' && item.status !== 'claimed' && (
              <Button onClick={() => handleClaim(item.id)}>{t('claim')}</Button>
            )
            || (user.role === 'admin' && item.status !== 'claimed' && (
              <Button color="error" onClick={async () => {
                const token = localStorage.getItem('token');
                await fetch(`/api/items/${item.id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                });
                setDeleteSuccess('Item deleted successfully!');
                fetchItems();
              }}>{t('delete') || 'Delete'}</Button>
            ))
          }>
            <ListItemText
              primary={item.name + ' | ' + item.status + (item.owner ? ' | Owner: ' + item.owner : '')}
              secondary={item.description + (item.date ? ' | Date: ' + item.date : '')}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mt: 3 }}>{t('claimed')} {t('items')}</Typography>
      <List>
        {claimed.map(item => (
          <ListItem key={item.id}>
            <ListItemText
              primary={item.name + ' (' + t('claimed') + ') | ' + (item.owner ? 'Owner: ' + item.owner + ' | ' : '') + (item.date ? 'Date: ' + item.date : '')}
              secondary={
                item.claims && item.claims.length > 0 && item.claims[0].user
                  ? `${t('claimed')} ${t('by')}: ${item.claims[0].user.username}`
                  : t('claimed')
              }
            />
          </ListItem>
        ))}
      </List>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!deleteSuccess} autoHideDuration={3000} onClose={() => setDeleteSuccess('')}>
        <Alert onClose={() => setDeleteSuccess('')} severity="success" sx={{ width: '100%' }}>
          {deleteSuccess}
        </Alert>
      </Snackbar>
    </Box>
  );
} 