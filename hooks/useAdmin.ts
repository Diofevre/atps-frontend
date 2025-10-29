// Hook pour gérer le statut admin
'use client';

import { useState, useEffect } from 'react';

export function useAdmin() {
  const [adminStatus, setAdminStatus] = useState<{
    isAdmin: boolean;
    permissions: string[];
  }>({
    isAdmin: false,
    permissions: [],
  });

  useEffect(() => {
    // Vérifier le statut admin (à implémenter avec Keycloak)
    // Pour l'instant, par défaut non-admin
    setAdminStatus({
      isAdmin: false,
      permissions: [],
    });
  }, []);

  return {
    adminStatus,
    adminModeEnabled: adminStatus.isAdmin,
  };
}

