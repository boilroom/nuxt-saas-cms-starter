import { PrismaClient } from '@prisma/client';
export default defineEventHandler(async (event) => {
  const { code, email } = getQuery(event);
  const parsedURL = new URL(getRequestURL(event));
  if (code && typeof code === 'string' && email && typeof email === 'string' && typeof parsedURL.origin === 'string') {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        activationCode: code,
      },
    });
    if (user) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          userActive: true,
          activationCode: null,
        },
      });
      const session = await lucia.createSession(user.id, {});
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
      return sendRedirect(event, parsedURL.origin);
    } else {
      return sendRedirect(event, `${parsedURL.origin}/message?type=errors&code=invalid_email_activation_code`);
    }
  } else {
    return sendRedirect(event, `${parsedURL.origin}/message?type=errors&code=invalid_email_activation_code`);
  }
});