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
      initial: currentSavings, // Mapping initial to current_savings for now
      timeframe: months
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
        goalName: goal.objective_name,
        targetAmount: goal.target,
        currentSavings: goal.current_savings,
        months: goal.timeframe
      }
    });

    if (error) throw error;
    return data;
  }
};