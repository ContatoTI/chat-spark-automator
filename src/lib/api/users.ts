
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
  last_sign_in_at?: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  console.log("Fetching users from Supabase");
  
  try {
    // First, get auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching auth users:", authError);
      throw new Error(`Failed to fetch users: ${authError.message}`);
    }
    
    // Then get additional user info from the custom table
    const { data: appUsers, error: appError } = await supabase
      .from('appw_users')
      .select('*');
    
    if (appError) {
      console.error("Error fetching app users:", appError);
      throw new Error(`Failed to fetch appw_users: ${appError.message}`);
    }
    
    // Combine the data
    const users = authUsers?.users?.map(user => {
      const appUser = appUsers?.find(au => au.user_id === user.id);
      return {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        role: appUser?.role || 'user'
      };
    }) || [];
    
    console.log("Users fetched successfully:", users);
    return users;
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    throw error;
  }
};

export const createUser = async (email: string, password: string, role: string): Promise<void> => {
  console.log("Creating user:", { email, role });
  try {
    // Create the user in Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
    });
    
    if (error) {
      console.error("Error creating auth user:", error);
      throw error;
    }
    
    // Add the user to our custom table
    if (data.user) {
      console.log("Auth user created successfully, adding to appw_users:", data.user.id);
      const { error: insertError } = await supabase
        .from('appw_users')
        .insert([
          { 
            user_id: data.user.id, 
            email: email, 
            role: role 
          }
        ]);
        
      if (insertError) {
        console.error("Error adding user to appw_users:", insertError);
        
        // If we fail to add the user to our custom table, delete the auth user to maintain consistency
        await supabase.auth.admin.deleteUser(data.user.id);
        throw insertError;
      }
      
      console.log("User successfully created and added to appw_users");
    } else {
      throw new Error("User data not returned from auth signup");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appw_users')
      .update({ role })
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const resetUserPassword = async (userId: string, newPassword: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    
    if (error) throw error;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) throw authError;
    
    // Delete from custom table
    const { error: appError } = await supabase
      .from('appw_users')
      .delete()
      .eq('user_id', userId);
      
    if (appError) throw appError;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
