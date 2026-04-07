export function useAuth() {
  return {
    user: null,
    login: async () => undefined,
    logout: () => undefined
  };
}
