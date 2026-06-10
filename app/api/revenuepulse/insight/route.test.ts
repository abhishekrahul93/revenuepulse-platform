import { POST } from "./route";
import { getRevenuePulseSnapshot } from "@/lib/revenuepulse";

global.fetch = jest.fn();

describe("POST /api/revenuepulse/insight", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, OPENAI_API_KEY: "test-key" };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should handle error in catch block and return snapshot insight report when fetch rejects", async () => {
    const snapshot = getRevenuePulseSnapshot();

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const response = await POST();
    const data = await response.json();

    expect(data).toEqual(snapshot.insightReport);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should handle non-ok response and return snapshot insight report", async () => {
    const snapshot = getRevenuePulseSnapshot();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const response = await POST();
    const data = await response.json();

    expect(data).toEqual(snapshot.insightReport);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should handle timeout error in fetch and return snapshot insight report", async () => {
    const snapshot = getRevenuePulseSnapshot();

    // Mock the global fetch to reject with an AbortError as if the signal was aborted
    (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
      return new Promise((resolve, reject) => {
        if (options.signal) {
          options.signal.addEventListener('abort', () => {
            const error = new Error('The operation was aborted');
            error.name = 'AbortError';
            reject(error);
          });
        }
      });
    });

    // Replace the global setTimeout temporarily to execute immediately so the controller aborts
    jest.useFakeTimers();

    const responsePromise = POST();

    // Fast-forward timers to trigger the setTimeout callback in POST
    jest.runAllTimers();

    const response = await responsePromise;
    const data = await response.json();

    expect(data).toEqual(snapshot.insightReport);

    jest.useRealTimers();
  });
});
