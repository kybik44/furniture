// Импортируем необходимые типы из библиотеки Deno
import { serve } from "http/server";

// Используем SMTP клиент для отправки писем
import { SmtpClient } from "smtp";

// Тип для тела запроса
interface EmailRequestBody {
  to: string;
  subject: string;
  html: string;
}

// Функция для проверки, является ли тело запроса корректным
function isValidEmailRequestBody(body: unknown): body is EmailRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as EmailRequestBody).to === 'string' &&
    typeof (body as EmailRequestBody).subject === 'string' &&
    typeof (body as EmailRequestBody).html === 'string'
  );
}

// Конфигурация SMTP сервера
// Это пример для Gmail, вы можете заменить его на свой SMTP сервер
const SMTP_CONFIG = {
  hostname: Deno.env.get("SMTP_HOST") || "smtp.gmail.com",
  port: Number(Deno.env.get("SMTP_PORT")) || 465,
  username: Deno.env.get("SMTP_USERNAME") || "",
  password: Deno.env.get("SMTP_PASSWORD") || "",
};

// Функция для отправки email
async function sendEmail(options: EmailRequestBody) {
  // Создаем SMTP клиент
  const client = new SmtpClient();
  
  try {
    // Подключаемся к SMTP серверу
    await client.connectTLS({
      hostname: SMTP_CONFIG.hostname,
      port: SMTP_CONFIG.port,
      username: SMTP_CONFIG.username,
      password: SMTP_CONFIG.password,
    });

    // Отправляем письмо
    await client.send({
      from: Deno.env.get("EMAIL_FROM") || SMTP_CONFIG.username,
      to: options.to,
      subject: options.subject,
      content: options.html,
      html: options.html,
    });

    // Закрываем соединение
    await client.close();
    
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    // Закрываем соединение при ошибке
    try {
      await client.close();
    } catch (e) {
      console.error("Error closing SMTP connection:", e);
    }
    
    console.error("Error sending email:", error);
    throw error;
  }
}

// Обработчик HTTP запросов
serve(async (req) => {
  // Проверяем, что метод запроса - POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Парсим тело запроса
    const requestBody = await req.json();
    
    // Проверяем корректность тела запроса
    if (!isValidEmailRequestBody(requestBody)) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Отправляем email
    const result = await sendEmail(requestBody);
    
    // Возвращаем успешный ответ
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Обрабатываем ошибки
    console.error("Error in send-email function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}); 