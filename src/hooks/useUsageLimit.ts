import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const FREE_DAILY_LIMIT = 5;

interface UsageData {
  plan: string;
  daily_searches: number;
  last_search_date: string | null;
  can_use: boolean;
  remaining: number;
}

export function useUsageLimit() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const loadUsage = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('plan, daily_searches, last_search_date')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            plan: 'free',
            daily_searches: 0,
            last_search_date: null,
          });

        if (insertError) throw insertError;

        setUsage({
          plan: 'free',
          daily_searches: 0,
          last_search_date: null,
          can_use: true,
          remaining: FREE_DAILY_LIMIT,
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        const lastSearchDate = data.last_search_date;
        const isNewDay = !lastSearchDate || lastSearchDate !== today;

        let currentCount = isNewDay ? 0 : data.daily_searches;

        if (isNewDay && data.plan === 'free') {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ daily_searches: 0, last_search_date: today })
            .eq('id', user.id);

          if (updateError) throw updateError;
          currentCount = 0;
        }

        const isPremium = data.plan === 'premium';
        const canUse = isPremium || currentCount < FREE_DAILY_LIMIT;
        const remaining = isPremium ? -1 : Math.max(0, FREE_DAILY_LIMIT - currentCount);

        setUsage({
          plan: data.plan,
          daily_searches: currentCount,
          last_search_date: data.last_search_date,
          can_use: canUse,
          remaining: remaining,
        });
      }
    } catch (err) {
      console.error('Error loading usage:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsage();
  }, [user]);

  const incrementUsage = async (): Promise<boolean> => {
    if (!user || !usage) return false;

    if (usage.plan === 'premium') {
      return true;
    }

    if (usage.daily_searches >= FREE_DAILY_LIMIT) {
      setShowUpgradeModal(true);
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    const newCount = usage.daily_searches + 1;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          daily_searches: newCount,
          last_search_date: today,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUsage({
        ...usage,
        daily_searches: newCount,
        last_search_date: today,
        can_use: newCount < FREE_DAILY_LIMIT,
        remaining: Math.max(0, FREE_DAILY_LIMIT - newCount),
      });

      if (newCount >= FREE_DAILY_LIMIT) {
        setShowUpgradeModal(true);
      }

      return true;
    } catch (err) {
      console.error('Error incrementing usage:', err);
      return false;
    }
  };

  return {
    usage,
    loading,
    showUpgradeModal,
    setShowUpgradeModal,
    incrementUsage,
    refreshUsage: loadUsage,
  };
}
