const formValidations = () => {
  const required = (input) => {
    const { value, type } = input;
    let valid = true;
    
    if (type === "checkbox") {
      valid = input.checked;
    } else if (value.length < 1) valid = false;

    
    if (!valid) return "O campo é de preenchimento obrigatório";

    return null;
  };

  const email = (input) => {
    const { value } = input;
  
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  
    if (!valid) return "O e-mail informado não é válido";
  
    return null;
  };

  const mailExtension = (input) => {
    const { value } = input;

    const valid = /^@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(value);

    if (!valid) return "A extensão de e-mail deve começar com '@' e conter domínio válido (ex: @exemplo.com)";

    return null;
  };

  const matchPassword = (input, formValues) => {
    const { value } = input;
    const password = formValues?.password || '';

    if (value !== password) return "As senhas não são correspondentes";

    return null;
  };

  return {
    required,
    email,
    mailExtension,
    matchPassword,
  };
};

export default formValidations;
