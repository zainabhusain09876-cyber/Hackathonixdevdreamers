import { supabase } from "@/integrations/supabase/client";

export interface GoalData {
  goalName: string;
  targetAmount: number;
  currentSavings: number;
  months: number;
}

export const goalService = {
  async createGoal(goalData: GoalData) {
    const { goalName, targetAmount, currentSavings, months } = goalData;

    if (months <= 0) throw new Error("Deadline must be greater than 0 months");
    
    const { data, error } = await supabase.from("goals").insert({
      objective_name: goalName,
      target: targetAmount,
      current_savings: currentSavings,
      initial: currentSavings,
      timeframe: months
    }).select().single();

    if (error) throw error;

    // Create an initial transaction
    if (currentSavings > 0) {
      await supabase.from("transactions").insert({
        goal_id: data.id,
        amount: currentSavings
      });
    }

    return data;
  },

  async fetchGoals() {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteGoal(id: string) {
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async analyzeGoal(goal: any) {
    const { data, error } = await supabase.functions.invoke('analyze-goal', {
      body: {
        goalName: goal.objective_name,
        targetAmount: goal.target,
        currentSavings: goal.current_savings,
        months: goal.timeframe
      }
    });

    if (error) throw error;
    return data;
  },

  async fetchTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, goals(objective_name)")
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addSavings(goalId: string, amount: number) {
    // Get current savings
    const { data: goal } = await supabase.from("goals").select("current_savings").eq("id", goalId).single();
    const newTotal = (goal?.current_savings || 0) + amount;

    // Update goal
    const { error: updateError } = await supabase
      .from("goals")
      .update({ current_savings: newTotal })
      .eq("id", goalId);

    if (updateError) throw updateError;

    // Add transaction
    const { error: transError } = await supabase.from("transactions").insert({
      goal_id: goalId,
      amount: amount
    });

    if (transError) throw transError;
  }
};