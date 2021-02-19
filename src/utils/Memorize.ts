/**
 * Used for caching results of pure functions where input does not change
 * @param func The function to be memorized
 */
export function memorizeResult<Result, T extends (...params: any[]) => Result>(
  func: T
): T {
  const memory = new Map<string, Result>();
  const memoryResult = (...params: any[]) => {
    if (!memory.get(params.join())) {
      memory.set(params.join(), func(...params));
    }
    return memory.get(params.join());
  };
  return memoryResult as T;
}
