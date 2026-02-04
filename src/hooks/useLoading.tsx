import { useState } from "react";

function useLoading() {
  const [loading, setLoading] = useState(false);

  return {
    loading,
    setLoading,
  };
}

export default useLoading;
