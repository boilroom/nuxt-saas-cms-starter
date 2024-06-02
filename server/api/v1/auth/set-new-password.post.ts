import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';
import dataValidation from '~/utils/dataValidation';

export default eventHandler(async (event) => {

  const formData = await readFormData(event);

  const password = formData.get('password')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const code = formData.get('code')?.toString() || '';

  const { error: emailError } = dataValidation('email', email);
  const { error: passwordError } = dataValidation('password', password);
  const { error: codeError } = dataValidation('code', code);

  if (emailError || codeError || passwordError) {
    throw createError({
      message: 'Invalid email or code',
      data: {
        errorCode: 'invalid_data_validation',
      },
      statusCode: 400,
    });
  }

  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      email: email,
      recoveryCode: code,
      recoveryCodeExpires: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    throw createError({
      message: 'Invalid email or code',
      data: {
        errorCode: 'invalid_email_or_code',
      },
      statusCode: 400,
    });
  }

  const passwordHash = await hash(password, {
    parallelism: 1,
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash: passwordHash,
      recoveryCode: null,
      recoveryCodeExpires: null,
    },
  });

  setResponseHeaders(event, {
    'Content-Type': 'application/json',
  });

  return {
    statusCode: 200,
    body: {},
  };

});