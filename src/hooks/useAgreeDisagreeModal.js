import { useState, useCallback } from "react";

const useAgreeDisagreeModal = (isValid, trigger) => {
  const [dialogStep, setDialogStep] = useState("form");

  const handleClick = useCallback(() => {
    trigger();
    if (isValid) {
      setDialogStep("agreePopup");
    }
  }, [isValid, trigger, setDialogStep]);

  return { dialogStep, handleClick };
};

export default useAgreeDisagreeModal;
