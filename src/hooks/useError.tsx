import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function useError(Error?: string) {
  const [error, setError] = useState(Error || "");
  const { toast } = useToast();

 const addError = (error: string) => {
  toast({
    title: error,
    // description: error,
    variant: "destructive",
  });
    // setError(error);
    // setTimeout(() => {
    //   setError("");
    // }, 6000);
  };

  return {
    error,
    setError: addError,
  };
}

export default useError;
