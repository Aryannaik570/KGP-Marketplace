'use client';
import { useState } from 'react';

export default function DeleteTechButton({ id }) {
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const executeDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      const res = await fetch(`/api/founder/technologies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete.');
        setLoading(false);
      }
    } catch (err) {
      alert('Error communicating with server.');
      setLoading(false);
    }
  };

  const handleInitialClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button 
          onClick={executeDelete} 
          disabled={loading}
          style={{
            background: '#DC2626',
            color: 'white',
            border: 'none',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: '0.2s ease',
          }}
        >
          {loading ? '...' : 'Confirm'}
        </button>
        <button 
          onClick={handleCancel} 
          disabled={loading}
          style={{
            background: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleInitialClick} 
      style={{
        background: '#FFE0E0',
        color: '#DC2626',
        border: '1px solid #FCC4C4',
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '13px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.2s ease',
      }}
    >
      Delete
    </button>
  );
}
