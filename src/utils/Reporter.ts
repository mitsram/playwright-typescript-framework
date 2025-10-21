import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './Logger';

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
  timestamp: Date;
}

export class Reporter {
  private static logger = Logger.getInstance();
  private static results: TestResult[] = [];

  public static addTestResult(result: TestResult): void {
    this.results.push(result);
    this.logger.info(`Test result added: ${result.testName} - ${result.status}`);
  }

  public static generateJsonReport(outputPath?: string): void {
    const reportPath = outputPath || path.resolve(process.cwd(), 'test-results', 'custom-report.json');
    const reportDir = path.dirname(reportPath);

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const report = {
      summary: this.generateSummary(),
      results: this.results,
      generatedAt: new Date().toISOString()
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.logger.info(`JSON report generated: ${reportPath}`);
  }

  public static generateHtmlReport(outputPath?: string): void {
    const reportPath = outputPath || path.resolve(process.cwd(), 'test-results', 'custom-report.html');
    const reportDir = path.dirname(reportPath);

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const htmlContent = this.createHtmlContent();
    fs.writeFileSync(reportPath, htmlContent);
    this.logger.info(`HTML report generated: ${reportPath}`);
  }

  private static generateSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%',
      totalDuration: `${(totalDuration / 1000).toFixed(2)}s`
    };
  }

  private static createHtmlContent(): string {
    const summary = this.generateSummary();
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Test Automation Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
    .summary-card { padding: 15px; border-radius: 8px; text-align: center; }
    .passed { background: #d4edda; color: #155724; }
    .failed { background: #f8d7da; color: #721c24; }
    .skipped { background: #fff3cd; color: #856404; }
    .total { background: #d1ecf1; color: #0c5460; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #4CAF50; color: white; }
    tr:hover { background: #f5f5f5; }
    .status { padding: 5px 10px; border-radius: 4px; font-weight: bold; }
    .status.passed { background: #28a745; color: white; }
    .status.failed { background: #dc3545; color: white; }
    .status.skipped { background: #ffc107; color: black; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Test Automation Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
      <div class="summary-card total">
        <h3>${summary.total}</h3>
        <p>Total Tests</p>
      </div>
      <div class="summary-card passed">
        <h3>${summary.passed}</h3>
        <p>Passed</p>
      </div>
      <div class="summary-card failed">
        <h3>${summary.failed}</h3>
        <p>Failed</p>
      </div>
      <div class="summary-card skipped">
        <h3>${summary.skipped}</h3>
        <p>Skipped</p>
      </div>
    </div>
    
    <p><strong>Pass Rate:</strong> ${summary.passRate} | <strong>Duration:</strong> ${summary.totalDuration}</p>
    
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        ${this.results.map(r => `
          <tr>
            <td>${r.testName}</td>
            <td><span class="status ${r.status}">${r.status.toUpperCase()}</span></td>
            <td>${(r.duration / 1000).toFixed(2)}s</td>
            <td>${new Date(r.timestamp).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
    `;
  }

  public static clearResults(): void {
    this.results = [];
    this.logger.info('Test results cleared');
  }
}