/**
 * Email сервис для отправки писем через Supabase Edge Functions
 */

import { supabase } from '../lib/supabase';

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

/**
 * Отправляет email через Supabase Edge Function
 * @param options Опции для отправки email
 * @returns Promise, который резолвится, когда email отправлен
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Вызываем Edge Function для отправки email
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: options.to,
        subject: options.subject,
        html: options.body
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (err) {
    console.error('Email service error:', err);
    return false;
  }
};

/**
 * Отправляет email с кодом скидки
 * @param name Имя получателя
 * @param email Email получателя
 * @param discountCode Код скидки
 * @returns Promise, который резолвится, когда email отправлен
 */
export const sendDiscountCode = async (name: string, email: string, discountCode: string): Promise<boolean> => {
  const subject = 'Ваш код скидки 10% в магазине LegnoVivo';
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Здравствуйте, ${name}!</h2>
      
      <p>Благодарим вас за подписку на новости магазина LegnoVivo.</p>
      
      <p>Мы рады предоставить вам скидку 10% на первый заказ в нашем магазине.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
        <p style="font-weight: bold; font-size: 18px; margin: 0;">Ваш код скидки:</p>
        <h3 style="margin: 10px 0; font-size: 24px; letter-spacing: 2px;">${discountCode}</h3>
        <p style="margin: 0; font-size: 12px; color: #666;">Срок действия: 30 дней</p>
      </div>
      
      <p>Чтобы воспользоваться скидкой, просто введите этот код в поле "Промокод" при оформлении заказа.</p>
      
      <p>С уважением,<br>Команда LegnoVivo</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    body
  });
}; 