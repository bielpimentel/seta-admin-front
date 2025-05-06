import { useState, useEffect } from "react";

import eventEmitter from "src/utils/event-emitter";
import { validateInput } from "src/utils/validate-form";

const useInput = (inputRef, validations, name, onValidationChange, formValues) => {
  const [feedbackMessages, setFeedbackMessages] = useState(true);

  const handleValidateEvent = (messages) => {
    setFeedbackMessages(messages);
    if (onValidationChange) {
      onValidationChange(name, messages.length !== 0);
    }
  }

  useEffect(() => {
    if (name)
      eventEmitter.on('validate', handleValidateEvent, name);

    return () => {
      eventEmitter.off('validate', handleValidateEvent, name)
    }
  }, [name])

  const handleInput = () => {
    const validate = validateInput(inputRef.current, validations, formValues)

    handleValidateEvent(validate.messages);
  }

  return {
    handleInput,
    feedbackMessages
  }
}


export default useInput;