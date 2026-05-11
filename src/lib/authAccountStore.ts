type AccountRole = "patient" | "nutritionist";

type StoredAccount = {
  email: string;
  name: string;
  password: string;
  roles: AccountRole[];
};

const STORAGE_KEY = "vitacare.mock.accounts";

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const readAccounts = (): Record<string, StoredAccount> => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, StoredAccount>;
  } catch {
    return {};
  }
};

const writeAccounts = (accounts: Record<string, StoredAccount>): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

export const findStoredAccountByEmail = (email: string): StoredAccount | null => {
  const normalized = normalizeEmail(email);
  const accounts = readAccounts();
  return accounts[normalized] ?? null;
};

export const upsertStoredAccount = (params: {
  email: string;
  name: string;
  password: string;
  role: AccountRole;
}): { account: StoredAccount; roleAlreadyExists: boolean } => {
  const normalized = normalizeEmail(params.email);
  const accounts = readAccounts();
  const current = accounts[normalized];

  if (!current) {
    const created: StoredAccount = {
      email: normalized,
      name: params.name.trim(),
      password: params.password,
      roles: [params.role],
    };

    accounts[normalized] = created;
    writeAccounts(accounts);

    return { account: created, roleAlreadyExists: false };
  }

  const roleAlreadyExists = current.roles.includes(params.role);
  const nextRoles = roleAlreadyExists ? current.roles : [...current.roles, params.role];

  const updated: StoredAccount = {
    ...current,
    name: params.name.trim() || current.name,
    password: params.password,
    roles: nextRoles,
  };

  accounts[normalized] = updated;
  writeAccounts(accounts);

  return { account: updated, roleAlreadyExists };
};
