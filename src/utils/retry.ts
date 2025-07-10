export async function retryWithBackoff(fn: () => Promise<void>, retries: number = 3, delay: number = 500): Promise<void> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
    }
  }
}