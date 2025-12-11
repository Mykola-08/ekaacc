import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsyncOperation, useAsyncOperations, useOptimisticOperation } from '@/hooks/use-async-operation';
import { AppError } from '@/lib/error-handling';

// Mock the error handling module
jest.mock('@/lib/error-handling', () => ({
  errorHandler: {
    handleError: jest.fn((error) => {
      if (error instanceof AppError) return error;
      return new AppError(error.message, 'TEST_ERROR');
    }),
  },
  withRetry: jest.fn(async (operation) => {
    // Add a small delay to simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
    return await operation();
  }),
  AppError: class AppError extends Error {
    constructor(message: string, public code: string) {
      super(message);
      this.name = 'AppError';
    }
  },
}));

describe('useAsyncOperation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful operation', async () => {
    const mockData = { id: 1, name: 'Test' };
    const operation = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useAsyncOperation(operation));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should handle failed operation', async () => {
    const errorMessage = 'Operation failed';
    const operation = jest.fn().mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAsyncOperation(operation));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeInstanceOf(AppError);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it('should not execute when enabled is false', () => {
    const operation = jest.fn().mockResolvedValue({ data: 'test' });

    const { result } = renderHook(() => 
      useAsyncOperation(operation, { enabled: false })
    );

    expect(result.current.loading).toBe(false);
    expect(operation).not.toHaveBeenCalled();
  });

  it('should execute manually when enabled is false', async () => {
    const mockData = { data: 'test' };
    const operation = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => 
      useAsyncOperation(operation, { enabled: false })
    );

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual(mockData);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should call onSuccess callback', async () => {
    const mockData = { success: true };
    const operation = jest.fn().mockResolvedValue(mockData);
    const onSuccess = jest.fn();

    const { result } = renderHook(() => 
      useAsyncOperation(operation, { onSuccess })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  it('should call onError callback', async () => {
    const error = new Error('Test error');
    const operation = jest.fn().mockRejectedValue(error);
    const onError = jest.fn();

    const { result } = renderHook(() => 
      useAsyncOperation(operation, { onError })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(onError).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should handle retry', async () => {
    const mockData = { retry: true };
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useAsyncOperation(operation));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(AppError);
    });

    // Reset operation mock for retry
    operation.mockResolvedValue(mockData);

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('should handle refetch', async () => {
    const mockData = { refetch: true };
    const operation = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useAsyncOperation(operation));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    operation.mockClear();

    await act(async () => {
      await result.current.refetch();
    });

    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should set data manually', () => {
    const { result } = renderHook(() => useAsyncOperation(jest.fn()));

    const newData = { manual: true };
    act(() => {
      result.current.setData(newData);
    });

    expect(result.current.data).toEqual(newData);
  });

  it('should set loading state manually', () => {
    const { result } = renderHook(() => useAsyncOperation(jest.fn()));

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);
  });

  it('should set error manually', () => {
    const { result } = renderHook(() => useAsyncOperation(jest.fn()));

    const error = new AppError('Manual error', 'MANUAL_ERROR');
    act(() => {
      result.current.setError(error);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should handle stale time', async () => {
    const operation = jest.fn().mockResolvedValue({ data: 'test' });
    const staleTime = 100; // 100ms for faster test

    const { result } = renderHook(() => 
      useAsyncOperation(operation, { staleTime })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    operation.mockClear();

    // Try to execute again immediately - should not call operation
    await act(async () => {
      await result.current.execute();
    });

    expect(operation).not.toHaveBeenCalled();

    // Wait for stale time to pass
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, staleTime + 50));
    });

    // Now execute should call operation
    await act(async () => {
      await result.current.execute();
    });

    expect(operation).toHaveBeenCalledTimes(1);
  }, 10000);
});

describe('useAsyncOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle multiple operations', async () => {
    const operations = {
      users: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
      posts: jest.fn().mockResolvedValue([{ id: 1, title: 'Post 1' }]),
      comments: jest.fn().mockResolvedValue([{ id: 1, text: 'Comment 1' }]),
    };

    const { result } = renderHook(() => useAsyncOperations(operations));

    expect(result.current.overallLoading).toBe(false);

    // Execute all operations
    await act(async () => {
      await result.current.executeAll();
    });

    expect(result.current.overallLoading).toBe(false);

    expect(result.current.states.users.data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.current.states.posts.data).toEqual([{ id: 1, title: 'Post 1' }]);
    expect(result.current.states.comments.data).toEqual([{ id: 1, text: 'Comment 1' }]);
  });

  it('should handle partial failures', async () => {
    const operations = {
      success: jest.fn().mockResolvedValue({ success: true }),
      failure: jest.fn().mockRejectedValue(new Error('Operation failed')),
    };

    const { result } = renderHook(() => useAsyncOperations(operations));

    // Execute all operations
    await act(async () => {
      await result.current.executeAll();
    });

    expect(result.current.overallLoading).toBe(false);

    expect(result.current.states.success.data).toEqual({ success: true });
    expect(result.current.states.success.error).toBe(null);
    
    expect(result.current.states.failure.data).toBe(null);
    expect(result.current.states.failure.error).toBeInstanceOf(AppError);
    
    expect(result.current.overallError).toBeInstanceOf(AppError);
  });

  it('should call onSuccess with all results', async () => {
    const operations = {
      data1: jest.fn().mockResolvedValue({ value: 1 }),
      data2: jest.fn().mockResolvedValue({ value: 2 }),
    };
    const onSuccess = jest.fn();

    const { result } = renderHook(() => 
      useAsyncOperations(operations, { onSuccess })
    );

    // Execute all operations
    await act(async () => {
      await result.current.executeAll();
    });

    expect(result.current.overallLoading).toBe(false);

    expect(onSuccess).toHaveBeenCalledWith({
      data1: { value: 1 },
      data2: { value: 2 },
    });
  });

  it('should execute individual operation', async () => {
    const operations = {
      test: jest.fn().mockResolvedValue({ result: 'success' }),
    };

    const { result } = renderHook(() => useAsyncOperations(operations));

    const operationResult = await result.current.execute('test');

    expect(operationResult).toEqual({ result: 'success' });
    expect(operations.test).toHaveBeenCalledTimes(1);
  });
});

describe('useOptimisticOperation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle optimistic updates', async () => {
    const currentData = { count: 5 };
    const optimisticData = { count: 6 };
    const finalData = { count: 6 };
    
    const operation = jest.fn().mockResolvedValue(finalData);

    const { result } = renderHook(() => 
      useOptimisticOperation(operation, {
        initialData: currentData,
        optimisticData,
      })
    );

    expect(result.current.data).toEqual(currentData);
    expect(result.current.isOptimistic).toBe(false);

    // Start the optimistic operation
    act(() => {
      result.current.executeOptimistic();
    });

    // Check state immediately while operation is in progress
    expect(result.current.data).toEqual(optimisticData);
    expect(result.current.isOptimistic).toBe(true);

    // Wait for the operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(finalData);
    expect(result.current.isOptimistic).toBe(false);
  });

  it('should rollback on error when rollbackOnError is true', async () => {
    const currentData = { count: 5 };
    const optimisticData = { count: 6 };
    const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));

    const { result } = renderHook(() => 
      useOptimisticOperation(operation, {
        initialData: currentData,
        optimisticData,
        rollbackOnError: true,
      })
    );

    // Start the optimistic operation
    act(() => {
      result.current.executeOptimistic();
    });

    // Check state while operation is in progress
    expect(result.current.data).toEqual(optimisticData);
    expect(result.current.isOptimistic).toBe(true);

    // Wait for the operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(currentData); // Should rollback
    expect(result.current.isOptimistic).toBe(false);
  });

  it('should not rollback on error when rollbackOnError is false', async () => {
    const currentData = { count: 5 };
    const optimisticData = { count: 6 };
    const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));

    const { result } = renderHook(() => 
      useOptimisticOperation(operation, {
        initialData: currentData,
        optimisticData,
        rollbackOnError: false,
      })
    );

    // Start the optimistic operation
    act(() => {
      result.current.executeOptimistic();
    });

    // Check state while operation is in progress
    expect(result.current.data).toEqual(optimisticData);
    expect(result.current.isOptimistic).toBe(true);

    // Wait for the operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(optimisticData); // Should not rollback
    expect(result.current.isOptimistic).toBe(false);
  });

  it('should handle manual rollback', async () => {
    const currentData = { count: 5 };
    const optimisticData = { count: 6 };
    
    const operation = jest.fn().mockResolvedValue(optimisticData);

    const { result } = renderHook(() => 
      useOptimisticOperation(operation, {
        initialData: currentData,
        optimisticData,
      })
    );

    // Start the optimistic operation
    act(() => {
      result.current.executeOptimistic();
    });

    // Check state while operation is in progress
    expect(result.current.data).toEqual(optimisticData);
    expect(result.current.isOptimistic).toBe(true);

    // Manual rollback
    act(() => {
      result.current.rollback();
    });

    expect(result.current.data).toEqual(currentData);
    expect(result.current.isOptimistic).toBe(false);
  });
});