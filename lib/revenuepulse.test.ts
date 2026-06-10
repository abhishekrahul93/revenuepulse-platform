import { getRevenuePulseCopilotResponse } from './revenuepulse';

describe('getRevenuePulseCopilotResponse', () => {
  it('should return MRR response for MRR related queries', () => {
    const queries = ['What about mrr?', 'Is there a revenue drop?', 'Is this real?', 'Any data issue?', 'Check data quality', 'Can we trust this?'];
    queries.forEach(q => {
      const response = getRevenuePulseCopilotResponse(q);
      expect(response.question).toBe(q);
      expect(response.answer).toMatch(/The MRR drop looks materially real/);
      expect(response.source).toBe('grounded-demo-engine');
      expect(response.nextActions).toBeDefined();
      expect(response.caveats).toBeDefined();
      expect(response.sources).toBeDefined();
      expect(response.evaluation).toBeDefined();
    });
  });

  it('should return churn response for churn related queries', () => {
    const queries = ['Why did churn increase?', 'What about retention?', 'Tell me about customer loss'];
    queries.forEach(q => {
      const response = getRevenuePulseCopilotResponse(q);
      expect(response.question).toBe(q);
      expect(response.answer).toMatch(/Churn increased because the May cohort/);
      expect(response.source).toBe('grounded-demo-engine');
      expect(response.nextActions).toBeDefined();
      expect(response.caveats).toBeDefined();
      expect(response.sources).toBeDefined();
      expect(response.evaluation).toBeDefined();
    });
  });

  it('should return marketing response for channel/campaign related queries', () => {
    const queries = ['Which channel to cut?', 'What campaign is bad?', 'Tell me about spend', 'What is our cac?', 'Check roi', 'Should we cut marketing?'];
    queries.forEach(q => {
      const response = getRevenuePulseCopilotResponse(q);
      expect(response.question).toBe(q);
      expect(response.answer).toMatch(/Cut or pause Paid Social first/);
      expect(response.source).toBe('grounded-demo-engine');
      expect(response.nextActions).toBeDefined();
      expect(response.caveats).toBeDefined();
      expect(response.sources).toBeDefined();
      expect(response.evaluation).toBeDefined();
    });
  });

  it('should return fallback response for other queries', () => {
    const queries = ['Hello there', 'What is the meaning of life?', 'Random text query'];
    queries.forEach(q => {
      const response = getRevenuePulseCopilotResponse(q);
      expect(response.question).toBe(q);
      expect(response.answer).toMatch(/This week the CEO should treat May as a revenue-growth incident/);
      expect(response.source).toBe('grounded-demo-engine');
      expect(response.nextActions).toBeDefined();
      expect(response.caveats).toBeDefined();
      expect(response.sources).toBeDefined();
      expect(response.evaluation).toBeDefined();
    });
  });
});
