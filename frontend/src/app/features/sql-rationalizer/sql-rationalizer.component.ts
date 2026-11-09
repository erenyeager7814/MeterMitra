import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SqlAnalysisResponse } from '../../core/models/rickshaw.models';
import { RickshawApiService } from '../../core/services/rickshaw-api.service';

interface SqlTable { name: string; alias: string; }
interface SchemaColumn { name: string; type: string; }
interface SchemaTable { name: string; columns: SchemaColumn[]; }
interface SqlFinding { severity: 'High' | 'Medium' | 'Info'; title: string; detail: string; suggestion: string; }

@Component({
  selector: 'app-sql-rationalizer',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './sql-rationalizer.component.html',
  styleUrl: './sql-rationalizer.component.css'
})
export class SqlRationalizerComponent {
  sql = `SELECT *\nFROM rides r\nJOIN drivers d ON r.driver_id = d.id\nWHERE r.status = 'COMPLETED'\n  AND r.created_at >= :start_date\nORDER BY r.created_at DESC;`;
  schema = `CREATE TABLE rides (id BIGINT PRIMARY KEY, driver_id BIGINT NOT NULL, status VARCHAR(24), created_at TIMESTAMP);\nCREATE TABLE drivers (id BIGINT PRIMARY KEY, name VARCHAR(120));`;
  analyzed = false;
  tables: SqlTable[] = [];
  schemaTables: SchemaTable[] = [];
  columns: string[] = [];
  parameters: string[] = [];
  findings: SqlFinding[] = [];
  statementType = 'Unknown';
  aiAnalysis?: SqlAnalysisResponse;
  aiLoading = false;
  aiError = '';

  constructor(private readonly api: RickshawApiService) {}

  analyzeWithAi(): void {
    this.aiLoading = true;
    this.aiError = '';
    this.aiAnalysis = undefined;
    this.api.analyzeSql(this.sql, this.schema).subscribe({
      next: result => { this.aiAnalysis = result; this.aiLoading = false; },
      error: error => {
        this.aiLoading = false;
        this.aiError = error?.error?.message || 'Could not reach the local model. Start Ollama with qwen3.5:4b and start the backend.';
      }
    });
  }

  analyze(): void {
    const clean = this.stripComments(this.sql);
    const code = this.stripLiterals(clean);
    const findings: SqlFinding[] = [];
    this.schemaTables = this.parseSchema(this.schema);
    this.tables = this.readTables(code);
    this.parameters = [...new Set([...clean.matchAll(/(?<!:):([a-zA-Z_]\w*)|\$([1-9]\d*)|@([a-zA-Z_]\w*)/g)].map(m => m[1] || m[2] || m[3]))];
    this.columns = [...new Set([...code.matchAll(/\b([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)\b/g)].map(m => `${m[1]}.${m[2]}`))];
    const verb = code.trim().match(/^(SELECT|WITH|INSERT|UPDATE|DELETE|MERGE|CREATE|ALTER|DROP|TRUNCATE)\b/i);
    this.statementType = verb ? verb[1].toUpperCase() : 'Unknown';

    if (/\bSELECT\s+\*/i.test(code)) findings.push({ severity: 'Medium', title: 'Broad projection', detail: 'SELECT * returns every column, so the output can change when the table schema changes.', suggestion: 'List the required columns explicitly and qualify them with table aliases.' });
    if (this.tables.length > 1 && !/\bJOIN\b/i.test(code)) findings.push({ severity: 'Medium', title: 'Multiple table references', detail: 'More than one table appears in the statement without an explicit JOIN.', suggestion: 'Check that each table relationship and join condition is intentional.' });
    if (/\bJOIN\b/i.test(code) && !/\bON\b|\bUSING\s*\(/i.test(code)) findings.push({ severity: 'High', title: 'Join condition not detected', detail: 'A JOIN keyword is present, but this review could not find an ON or USING condition.', suggestion: 'Confirm the join type and provide the intended key relationship.' });
    if (/\b(?:DROP|TRUNCATE|DELETE|UPDATE)\b/i.test(code) && !/\bWHERE\b/i.test(code)) findings.push({ severity: 'High', title: 'Unbounded write risk', detail: 'A write or destructive statement has no WHERE clause detected.', suggestion: 'Verify the intended scope and add a predicate or transaction guard where appropriate.' });
    if (/\b(?:OR\s+1\s*=\s*1|UNION\s+SELECT)\b/i.test(code)) findings.push({ severity: 'High', title: 'Review dynamic SQL safety', detail: 'A pattern often associated with unsafe or overly broad dynamic SQL was found.', suggestion: 'Use driver bind parameters and review the complete query construction path.' });

    if (this.parameters.length) findings.push({ severity: 'Info', title: `${this.parameters.length} bind parameter${this.parameters.length === 1 ? '' : 's'} found`, detail: `Parameters: ${this.parameters.map(p => `:${p}`).join(', ')}. Their values are not interpolated by this analyzer.`, suggestion: 'Keep parameter names descriptive and bind values with the database driver.' });
    this.checkNamingConsistency(findings);
    if (this.tables.length) findings.push({ severity: 'Info', title: 'Table and alias map', detail: this.tables.map(t => `${t.name} → ${t.alias}`).join(' · '), suggestion: 'Use distinct, readable aliases and qualify columns consistently.' });

    if (this.schema.trim() && this.schemaTables.length === 0) {
      findings.push({ severity: 'Medium', title: 'Schema could not be parsed', detail: 'No CREATE TABLE definitions or supported table/column declarations were recognized.', suggestion: 'Provide standard CREATE TABLE statements. The schema check currently handles simple column definitions and common SQL types.' });
    } else if (this.schemaTables.length) {
      this.reconcileTables(code, findings);
      this.reconcileColumns(code, findings);
    } else {
      findings.push({ severity: 'Info', title: 'Schema context not supplied', detail: 'Table and column existence, types, keys, nullability, and naming consistency cannot be confirmed.', suggestion: 'Paste relevant CREATE TABLE definitions to check referenced names against the supplied schema.' });
    }
    if (!findings.length) findings.push({ severity: 'Info', title: 'No heuristic flags found', detail: 'This static review did not find a configured pattern to flag.', suggestion: 'Review the query against its schema, query plan, and business requirements.' });
    this.findings = findings;
    this.analyzed = true;
  }

  private stripComments(sql: string): string {
    return sql.replace(/--[^\n]*/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ');
  }

  private stripLiterals(sql: string): string {
    return sql.replace(/'(?:''|[^'])*'/g, "''").replace(/"(?:""|[^"])*"/g, '""');
  }

  private readTables(sql: string): SqlTable[] {
    const pattern = /\b(?:FROM|JOIN|UPDATE|INTO)\s+([\w.]+)(?:\s+(?:AS\s+)?(?!ON\b|WHERE\b|JOIN\b|LEFT\b|RIGHT\b|INNER\b|FULL\b|CROSS\b|SET\b)([\w]+))?/gi;
    const result: SqlTable[] = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(sql))) {
      const name = match[1];
      const alias = match[2] && !/^(WHERE|ON|GROUP|ORDER|LIMIT|OFFSET|SET|VALUES)$/i.test(match[2]) ? match[2] : name.split('.').pop() || name;
      if (!result.some(t => t.name.toLowerCase() === name.toLowerCase() && t.alias.toLowerCase() === alias.toLowerCase())) result.push({ name, alias });
    }
    return result;
  }

  private parseSchema(source: string): SchemaTable[] {
    const tables: SchemaTable[] = [];
    const tablePattern = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([\w."`\[\]]+)\s*\(/gi;
    let match: RegExpExecArray | null;
    while ((match = tablePattern.exec(source))) {
      const name = this.cleanIdentifier(match[1]);
      const open = tablePattern.lastIndex - 1;
      let depth = 1;
      let close = open + 1;
      while (close < source.length && depth > 0) {
        if (source[close] === '(') depth++;
        else if (source[close] === ')') depth--;
        close++;
      }
      if (depth !== 0) continue;
      const body = source.slice(open + 1, close - 1);
      const columns: SchemaColumn[] = [];
      for (const segment of this.splitDefinitions(body)) {
        const field = segment.trim().match(/^([\w"`\[\]]+)\s+([\w]+(?:\s*\([^)]*\))?(?:\s+(?:PRECISION|VARYING))?)/i);
        if (!field || /^(CONSTRAINT|PRIMARY|FOREIGN|UNIQUE|CHECK|KEY|INDEX|EXCLUDE)$/i.test(this.cleanIdentifier(field[1]))) continue;
        columns.push({ name: this.cleanIdentifier(field[1]), type: field[2].replace(/\s+/g, ' ').toUpperCase() });
      }
      if (columns.length) tables.push({ name, columns });
    }
    return tables;
  }

  private splitDefinitions(body: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < body.length; i++) {
      if (body[i] === '(') depth++;
      else if (body[i] === ')') depth--;
      else if (body[i] === ',' && depth === 0) { parts.push(body.slice(start, i)); start = i + 1; }
    }
    parts.push(body.slice(start));
    return parts;
  }

  private cleanIdentifier(value: string): string {
    return value.replace(/^["`\[]|["`\]]$/g, '').split('.').pop() || value;
  }

  private reconcileTables(sql: string, findings: SqlFinding[]): void {
    const known = new Map(this.schemaTables.map(t => [t.name.toLowerCase(), t]));
    for (const table of this.tables) {
      const shortName = table.name.split('.').pop()!.toLowerCase();
      if (!known.has(shortName)) findings.push({ severity: 'High', title: `Table not found in supplied schema: ${table.name}`, detail: `The query references ${table.name}, but no matching CREATE TABLE definition was parsed.`, suggestion: 'Check for a misspelling, schema qualification mismatch, view, CTE, or missing table definition.' });
    }
    for (const table of this.schemaTables) {
      if (!this.tables.some(t => t.name.split('.').pop()!.toLowerCase() === table.name.toLowerCase())) findings.push({ severity: 'Info', title: `Schema table not used: ${table.name}`, detail: `The supplied schema defines ${table.name}, but this query does not reference it.`, suggestion: 'This may be intentional; remove unrelated definitions from the review context if they obscure the relevant schema.' });
    }
    const aliases = new Set<string>();
    for (const table of this.tables) {
      if (aliases.has(table.alias.toLowerCase())) findings.push({ severity: 'Medium', title: `Alias reused: ${table.alias}`, detail: 'The same alias is assigned to multiple detected table references.', suggestion: 'Give each table reference a unique alias so qualified columns are unambiguous.' });
      aliases.add(table.alias.toLowerCase());
    }
    if (!this.tables.length && /\b(?:SELECT|WITH)\b/i.test(sql)) findings.push({ severity: 'Info', title: 'No base table reference detected', detail: 'The statement may use CTEs, subqueries, or a dialect pattern this analyzer does not recognize.', suggestion: 'Review nested query scopes manually; this analyzer only maps direct FROM and JOIN references.' });
  }

  private reconcileColumns(sql: string, findings: SqlFinding[]): void {
    const tableByAlias = new Map<string, SchemaTable>();
    for (const ref of this.tables) {
      const schemaTable = this.schemaTables.find(t => t.name.toLowerCase() === ref.name.split('.').pop()!.toLowerCase());
      if (schemaTable) {
        tableByAlias.set(ref.alias.toLowerCase(), schemaTable);
        tableByAlias.set(ref.name.split('.').pop()!.toLowerCase(), schemaTable);
      }
    }
    const seen = new Set<string>();
    const refs = [...sql.matchAll(/\b([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)\b/g)];
    for (const ref of refs) {
      const owner = ref[1].toLowerCase();
      const col = ref[2];
      const table = tableByAlias.get(owner);
      if (!table) continue;
      const key = `${table.name.toLowerCase()}.${col.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!table.columns.some(c => c.name.toLowerCase() === col.toLowerCase())) {
        const close = table.columns.map(c => c.name).sort((a, b) => this.editDistance(col.toLowerCase(), a.toLowerCase()) - this.editDistance(col.toLowerCase(), b.toLowerCase()))[0];
        const hint = close && this.editDistance(col.toLowerCase(), close.toLowerCase()) <= 3 ? ` Did you mean ${table.name}.${close}?` : '';
        findings.push({ severity: 'High', title: `Column not found: ${ref[1]}.${col}`, detail: `The reference maps to table ${table.name}, but the supplied definition does not contain column ${col}.${hint}`, suggestion: 'Check the spelling and alias, or add the missing table definition if the column belongs to a view or derived table.' });
      }
    }
    if (refs.length === 0 && !/\bSELECT\s+\*/i.test(sql)) findings.push({ severity: 'Info', title: 'No qualified columns detected', detail: 'The analyzer cannot reliably map unqualified names to tables when multiple tables are present.', suggestion: 'Qualify column references with their table aliases to make ownership explicit and enable schema reconciliation.' });
  }

  private checkNamingConsistency(findings: SqlFinding[]): void {
    const params = this.parameters.filter(p => !/^\d+$/.test(p));
    const paramStyles = new Set(params.map(p => this.namingStyle(p)));
    if (paramStyles.size > 1) {
      findings.push({ severity: 'Medium', title: 'Bind variable naming is inconsistent', detail: `Detected styles: ${[...paramStyles].join(', ')} across ${params.join(', ')}.`, suggestion: 'Choose one convention for bind variables, such as lower_snake_case or lowerCamelCase, and apply it consistently.' });
    }
    const schemaNames = this.schemaTables.flatMap(t => t.columns.map(c => c.name));
    const styles = new Set(schemaNames.map(n => this.namingStyle(n)));
    if (styles.size > 1) {
      findings.push({ severity: 'Medium', title: 'Schema column naming is inconsistent', detail: `The supplied definitions mix ${[...styles].join(', ')} names.`, suggestion: 'Agree on a canonical column naming convention. Rename only after checking downstream queries, views, and application contracts.' });
    }
    const paramSet = new Set(paramStyles);
    const schemaStyles = new Set(schemaNames.map(n => this.namingStyle(n)));
    if (params.length && schemaNames.length && paramSet.size === 1 && schemaStyles.size === 1 && !paramSet.has([...schemaStyles][0])) {
      findings.push({ severity: 'Info', title: 'Parameter style differs from schema style', detail: `Bind variables use ${[...paramSet][0]} while schema columns use ${[...schemaStyles][0]}.`, suggestion: 'Consider matching the project convention where it improves readability; parameter names do not need to duplicate column names.' });
    }
  }

  private namingStyle(name: string): string {
    if (name.includes('_')) return 'snake_case';
    if (name.includes('-')) return 'kebab-case';
    if (/^[A-Z][a-z]/.test(name)) return 'PascalCase';
    if (/[A-Z]/.test(name)) return 'camelCase';
    return 'lowercase';
  }

  private editDistance(a: string, b: string): number {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let diagonal = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const above = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
        diagonal = above;
      }
    }
    return row[b.length];
  }
}
