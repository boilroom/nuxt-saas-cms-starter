import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { useCompiler } from '#vue-email';
import { EmailSender } from '~/utils/emailSender';
import dataValidation from '~/utils/dataValidation';

export default eventHandler(async (event) => {
  const formData = await readFormData(event);

  const email = formData.get('email')?.toString() || '';

  const { error: emailError } = dataValidation('email', email);

  if (emailError) {
    throw createError({
      message: 'Invalid email',
      data: {
        errorCode: 'invalid_email_validation',
      },
      statusCode: 400,
    });
  }

  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw createError({
      message: 'Something went wrong',
      data: {
        errorCode: 'default',
      },
      statusCode: 400,
    });
  }

  const recoveryCode = crypto.randomBytes(32).toString('hex');

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      recoveryCode: recoveryCode,
      recoveryCodeExpires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  const parsedURL = new URL(getRequestURL(event));

  const template = await useCompiler('PasswordRecovery.vue', {
    props: {
      recoveryLink: `${parsedURL.origin}/auth/set-new-password?email=${email}&code=${recoveryCode}`,
    },
  });

  const emailSender = new EmailSender(
    template.html,
    `noreply@${parsedURL.host}`,
    email,
    'Password recovery',
    'Our Team',
  );
  const emailSended = emailSender.send();

  if (!emailSended) {
    throw createError({
      message: 'Email not sent',
      data: {
        errorCode: 'email_sent_error',
      },
      statusCode: 500,
    });
  }

  setResponseHeaders(event, {
    'Content-Type': 'application/json',
  });

  return {
    statusCode: 200,
    body: {},
  };

});