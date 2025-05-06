import eventEmitter from './event-emitter';
import formValidations from './validations';

export function validateForm(formRef, validateSchema, formValues) {
  const inputs = formRef.current.querySelectorAll('input, select, textarea');

  const messages = [];
  let valid = true;

  inputs.forEach((input) => {
    const { name } = input;
    const obj = validateSchema;
    const validations = name in validateSchema ? obj[name] : null;

    const { messages: input_messages } = validateInput(input, validations, formValues);

    if (input_messages.length > 0)
      valid = false;

    messages.push({ [name]: input_messages });

    eventEmitter.emit('validate', input_messages, name);
  });

  return {
    valid,
    messages,
  };
}

export function validateInput(input, validations, formValues) {
  const { email, required, mailExtension, matchPassword } = formValidations();

  const result = [];

  if (validations) {
    if (validations.includes('required')) result.push(required(input));
    if (validations.includes('email')) result.push(email(input));
    if (validations.includes('mailExtension')) result.push(mailExtension(input));
    if (validations.includes('matchPassword')) result.push(matchPassword(input, formValues));
  }

  const messages = result.filter((res) => res !==null);

  return {
    valid: messages.length === 0,
    messages,
  };
}
