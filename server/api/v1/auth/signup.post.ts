import crypto from 'crypto';
import { hash } from '@node-rs/argon2';
import { PrismaClient } from '@prisma/client';
import { useCompiler } from '#vue-email';
import { EmailSender } from '~/utils/emailSender';
import dataValidation from '~/utils/dataValidation';

export default eventHandler(async (event) => {
  const formData = await readFormData(event);

  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  const { error: emailError } = dataValidation('email', email);
  const { error: passwordError } = dataValidation('password', password);

  if (emailError) {
    throw createError({
      message: 'Invalid email',
      data: {
        errorCode: 'invalid_credentials_validation',
      },
      statusCode: 400,
    });
  }
  if (passwordError) {
    throw createError({
      message: 'Invalid password',
      data: {
        errorCode: 'invalid_credentials_validation',
      },
      statusCode: 400,
    });
  }

  const passwordHash = await hash(password, {
    parallelism: 1,
  });

  const activationCode = crypto.randomBytes(32).toString('hex');

  const prisma = new PrismaClient();
  await prisma.user.create({
    data: {
      email: email,
      passwordHash: passwordHash,
      activationCode: activationCode,
    },
  }).catch(() => {
    throw createError({
      message: 'Email already exists',
      data: {
        errorCode: 'user_exists',
      },
      statusCode: 400,
    });
  });

  const parsedURL = new URL(getRequestURL(event));
  const template = await useCompiler('Signup.vue', {
    props: {
      verificationLink: `${parsedURL.origin}/api/v1/auth/verify-email?email=${email}&code=${activationCode}`,
    },
  });

  const emailSender = new EmailSender(
    template.html,
    `noreply@${parsedURL.host}`,
    email,
    'Welcome aboard!',
    'Our Team',
  );

  if (!emailSender.send()) {
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