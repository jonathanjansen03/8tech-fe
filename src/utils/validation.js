const FIRST_NAME = 'firstName';
const LAST_NAME = 'lastName';

const validators = {
  name: (value) => value.length > 1,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value),
};

const form = (field, value) => {
  if (field === FIRST_NAME || field === LAST_NAME) {
    return validators.name(value);
  }

  if (!Object.hasOwn(validators, field)) {
    return true;
  }

  return validators[field](value);
};

export default {
  ...validators,
  form,
};
