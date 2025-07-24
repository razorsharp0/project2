import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/items', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(setItems);
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/items/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setItems(items.filter(i => i.id !== id));
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditForm(item);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    await fetch(`/api/items/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(editForm),
    });
    setEditId(null);
    // Optionally refresh items
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>{t('admin')}</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate('/items')}>
        {t('report')}
      </Button>
      <List>
        {items.map(item => (
          <ListItem key={item.id}>
            {editId === item.id ? (
              <>
                <TextField name="name" value={editForm.name} onChange={handleEditChange} />
                <TextField name="description" value={editForm.description} onChange={handleEditChange} />
                <Button onClick={handleEditSave}>Save</Button>
              </>
            ) : (
              <>
                <ListItemText primary={item.name} secondary={item.description} />
                <Button onClick={() => handleEdit(item)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 