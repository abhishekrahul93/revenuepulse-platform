import { getRevenuePulseSnapshot } from "./revenuepulse";

describe("getRevenuePulseSnapshot", () => {
  it("should return a correctly shaped snapshot with all required properties", () => {
    const snapshot = getRevenuePulseSnapshot();

    expect(snapshot).toBeDefined();

    // Check basic properties
    expect(typeof snapshot.generatedAt).toBe("string");
    expect(snapshot.companyContext).toBeDefined();
    expect(snapshot.companyContext.company).toBeDefined();

    // Check data arrays are populated
    expect(Array.isArray(snapshot.monthlyMetrics)).toBe(true);
    expect(snapshot.monthlyMetrics.length).toBeGreaterThan(0);

    expect(Array.isArray(snapshot.kpis)).toBe(true);
    expect(snapshot.kpis.length).toBeGreaterThan(0);

    expect(Array.isArray(snapshot.funnel)).toBe(true);
    expect(snapshot.funnel.length).toBeGreaterThan(0);

    expect(Array.isArray(snapshot.segments)).toBe(true);
    expect(snapshot.segments.length).toBeGreaterThan(0);

    expect(Array.isArray(snapshot.channels)).toBe(true);
    expect(snapshot.channels.length).toBeGreaterThan(0);

    expect(Array.isArray(snapshot.anomalies)).toBe(true);
    expect(snapshot.anomalies.length).toBeGreaterThan(0);

    expect(Array.isArray(snapshot.dataQuality)).toBe(true);
    expect(snapshot.dataQuality.length).toBeGreaterThan(0);

    expect(Array.isArray(snapshot.metricDefinitions)).toBe(true);
    expect(snapshot.metricDefinitions.length).toBeGreaterThan(0);

    expect(Array.isArray(snapshot.copilotQuestions)).toBe(true);
    expect(snapshot.copilotQuestions.length).toBeGreaterThan(0);

    // Check object structures
    expect(snapshot.insightReport).toBeDefined();
    expect(snapshot.insightReport.title).toBeDefined();
    expect(Array.isArray(snapshot.insightReport.findings)).toBe(true);
  });
});
