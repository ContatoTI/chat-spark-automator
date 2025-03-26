
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { useUsers } from "@/hooks/useUsers";

const Users = () => {
  const { users, isLoading, error, refetch } = useUsers();

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <UsersHeader onRefresh={refetch} />
        <UsersTable users={users} isLoading={isLoading} error={error} refetch={refetch} />
      </div>
    </Layout>
  );
};

export default Users;
