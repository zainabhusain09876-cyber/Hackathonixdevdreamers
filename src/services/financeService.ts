import { supabase } from "@/integrations/supabase/client";

export interface UserFinances {
  total_capital: number;
  burn_rate: number;
  efficiency: number;
}

export const financeService = {
  async getFinances() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_finances")
      .select("*")
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateFinances(finances: Partial<UserFinances>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("user_finances")
      .upsert({
        user_id: user.id,
        ...finances,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};