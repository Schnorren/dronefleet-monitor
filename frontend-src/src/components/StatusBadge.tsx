'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'maintenance' | 'flying' | 'charging' | 'error';
  className?: string;
}

const statusClasses = {
  active: 'status-active',
  inactive: 'status-inactive',
  maintenance: 'status-maintenance',
  flying: 'status-flying',
  charging: 'status-badge bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  error: 'status-error'
};

const statusLabels = {
  active: 'Ativo',
  inactive: 'Inativo',
  maintenance: 'Manutenção',
  flying: 'Em voo',
  charging: 'Carregando',
  error: 'Erro'
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${statusClasses[status]} ${className}`}>
      {statusLabels[status]}
    </span>
  );
}
