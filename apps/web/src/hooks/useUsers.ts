import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface User {
    id: string;
    full_name: string | null;
    email: string | null;
    role: "user" | "trainer" | "admin";
    created_at: string;
    updated_at?: string;
    is_super_admin?: boolean;
}

interface UseUsersReturn {
    users: User[];
    loading: boolean;
    error: string | null;
    refreshUsers: () => Promise<void>;
}

export function useUsers(): UseUsersReturn {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            // Usar el nuevo endpoint del servidor que tiene permisos para auth.admin.listUsers
            const response = await fetch("/api/admin/users");

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("No tienes permisos de super admin");
                } else if (response.status === 401) {
                    throw new Error("No estás autenticado");
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            }

            const { users } = await response.json();
            setUsers(users);
        } catch (err: any) {
            setError(err.message || "Error al cargar usuarios");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const refreshUsers = async () => {
        await fetchUsers();
    };

    return {
        users,
        loading,
        error,
        refreshUsers,
    };
}
