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
    if (currentSavings > targetAmount) throw new Error("Current savings cannot exceed target");

    const remaining = targetAmount - currentSavings;
    const monthlyRequired = Math.ceil(remaining / months);
    const progress = Number(((currentSavings / targetAmount) * 100).toFixed(2));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in");

    const { data, error } = await supabase.from("goals").insert({
      user_id: user.id,
      goal_name: goalName,
      target_amount: targetAmount,
      current_savings: currentSavings,
      deadline_months: months,
      monthly_required: monthlyRequired,
      progress: progress
    }).select().single();

    if (error) throw error;
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
        goalName: goal.goal_name,
        targetAmount: goal.target_amount,
        currentSavings: goal.current_savings,
        months: goal.deadline_months
      }
    });

    if (error) throw error;
    return data;
  }
};