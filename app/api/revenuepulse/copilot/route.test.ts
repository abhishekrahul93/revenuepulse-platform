import { POST } from './route';

// Mock lib
jest.mock('@/lib/revenuepulse', () => ({
  getRevenuePulseCopilotResponse: jest.fn((question) => ({
    question,
    answer: 'Fallback Answer',
    nextActions: ['Action 1'],
    caveats: ['Caveat 1'],
    sources: ['Source 1'],
    evaluation: {
      groundedness: 100,
      completeness: 100,
      actionability: 100,
      hallucinationRisk: 'Low',
      checks: ['Check 1']
    },
    source: 'fallback'
  })),
  getRevenuePulseSnapshot: jest.fn(() => ({
    kpis: [{ label: 'KPI', value: 100, change: 10, status: 'good', definition: 'def' }],
    anomalies: [],
    dataQuality: {},
    metricDefinitions: {},
    segments: {},
    channels: {}
  })),
}));

jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((data) => ({
        json: async () => data,
      })),
    },
  };
});

describe('Copilot POST route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return fallback if OPENAI_API_KEY is not set', async () => {
    process.env.OPENAI_API_KEY = '';

    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ question: 'Test question' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.answer).toBe('Fallback Answer');
    expect(data.question).toBe('Test question');
  });

  it('should handle request with invalid json', async () => {
    process.env.OPENAI_API_KEY = '';

    const request = new Request('http://localhost', {
      method: 'POST',
      body: 'invalid-json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.question).toBe('What should the CEO do this week?');
  });

  it('should return openai response if fetch succeeds', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
            question: 'Test question',
            answer: 'OpenAI Answer',
            nextActions: ['Action 1'],
            caveats: ['Caveat 1'],
            evaluation: {
                groundedness: 100,
                completeness: 100,
                actionability: 100,
                hallucinationRisk: 'Low',
                checks: ['Check 1']
            }
        }),
      }),
    } as any);

    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ question: 'Test question' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.answer).toBe('OpenAI Answer');
    expect(data.question).toBe('Test question');
  });

  it('should return fallback if fetch fails with not ok status', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    } as any);

    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ question: 'Test question' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.answer).toBe('Fallback Answer');
    expect(data.question).toBe('Test question');
  });

  it('should extract response from output array', async () => {
      process.env.OPENAI_API_KEY = 'test-key';

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          output: [{
              content: [{
                  text: JSON.stringify({
                      question: 'Test question',
                      answer: 'OpenAI Array Answer',
                      nextActions: ['Action 1'],
                      caveats: ['Caveat 1'],
                      evaluation: {
                          groundedness: 100,
                          completeness: 100,
                          actionability: 100,
                          hallucinationRisk: 'Low',
                          checks: ['Check 1']
                      }
                  })
              }]
          }],
        }),
      } as any);

      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ question: 'Test question' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.answer).toBe('OpenAI Array Answer');
  });

  it('should return fallback if json parsing fails', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    } as any);

    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ question: 'Test question' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.answer).toBe('Fallback Answer');
    expect(data.question).toBe('Test question');
  });

  it('should return fallback if openAI throws an error during fetch network call', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ question: 'Test question' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.answer).toBe('Fallback Answer');
    expect(data.question).toBe('Test question');
  });
});
