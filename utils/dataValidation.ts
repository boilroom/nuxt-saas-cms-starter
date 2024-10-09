type VariousData = string | number | boolean | object | null | undefined;
type Output = {
  error: boolean;
  message: string;
};
export default function (type: string, value: VariousData, options?: { [key: string]: VariousData}): Output {
  switch (type) {
    case 'email':
      if (!/\S+@\S+\.\S+/.test(value as string)) {
        return {
          error: true,
          message: 'Invalid email address',
        };
      }
      break;
    case 'password':
      if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/gm.test(value as string)) {
        return {
          error: true,
          message: 'Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters'
        };
      }
      break;
    case 'digits':
      if (!/^\d+$/.test(value as string)) {
        return {
          error: true,
          message: 'This field must contain only digits'
        };
      }
      break;
    case 'code':
      if (typeof value !== 'string' || value.length !== 64) {
        return {
          error: true,
          message: 'Invalid code'
        };
      }
      break;
    case 'required':
      if (!value) {
        return {
          error: true,
          message: 'This field is required',
        };
      }
      break;
  }
  return { error: false, message: 'valid data'};
}