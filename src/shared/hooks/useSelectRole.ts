import { useCallback, useState } from 'react';
import type { UserRole } from '@shared/components/ui/RoleCard';
import { kvSet } from '@shared/storage/kv';

const ROLE_KEY = 'app_role';

export interface UseSelectRoleReturn {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
  handleContinue: () => Promise<void>;
}

export function useSelectRole(): UseSelectRoleReturn {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = useCallback(async () => {
    if (selectedRole !== null) {
      await kvSet(ROLE_KEY, selectedRole);
    }
  }, [selectedRole]);

  return { selectedRole, setSelectedRole, handleContinue };
}
