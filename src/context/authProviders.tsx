// context/authProviders.ts
import { createContext, useContext, onMount, JSX } from "solid-js";
import { createSignal } from "solid-js";
import axios from "axios";
import { v4 as uuid } from "uuid";
import type { AuthContextType } from "~/types/auth";
import { Alert, AlertType } from "~/types/alert";

const AuthContext = createContext<AuthContextType>();

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/auth",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function createAuthContext(): AuthContextType {
  const [token, setToken] = createSignal<string | null>(null);
  const [role, setRole] = createSignal<string | null>(null);
  const [username, setUsername] = createSignal<string | null>(null);
  const isAuthenticated = () => !!token();
  const [alerts, setAlerts] = createSignal<Alert[]>([]);

  const showAlert = (
    type: AlertType,
    message: string,
    timeOut: number = 3000
  ) => {
    const id = uuid();
    const newAlert: Alert = { id, type, message, timeOut };
    setAlerts((prev) => [newAlert, ...prev]);
    setTimeout(() => removeAlert(id), newAlert.timeOut);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };
  const refresh = async () => {
    try {
      const res = await api.post("/refresh");
      const data = res.data;
      setToken(data.accessToken ?? null);
      setRole(data.role ?? null);
      setUsername(data.username ?? null);
    } catch (err) {
      setToken(null);
      setRole(null);
      setUsername(null);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await api.post("/login", { email, password });
    const data = res.data;
    setToken(data.accessToken);
    setRole(data.role);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setToken(null);
      setRole(null);
    }
  };

  onMount(async () => {
    await refresh(); // atau refresh()
  });

  return {
    refresh,
    token,
    role,
    username,
    setToken,
    setRole,
    alerts,
    showAlert,
    removeAlert,
    setUsername,
    isAuthenticated,
    login,
    logout,
  };
}

export function AuthProvider(props: { children: JSX.Element }) {
  const auth = createAuthContext();
  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)!;
}
