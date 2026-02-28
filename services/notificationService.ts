import { supabase } from './supabase';

export const sendNotification = async (title: string, content: string) => {
  try {
    await supabase.from('notifications').insert({
      title,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('sendNotification error', e);
  }
};

