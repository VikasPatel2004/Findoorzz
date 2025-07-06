import { useState, useCallback } from 'react';

export const useFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitForm = useCallback(async (submitFunction, onSuccess = null) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await submitFunction();
      setSuccess(true);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    submitForm,
    resetForm,
  };
}; 