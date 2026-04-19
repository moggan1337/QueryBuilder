export class QueryBuilder {
  private sql = '';
  private params: any[] = [];

  select(fields: string | string[]) {
    const f = Array.isArray(fields) ? fields.join(', ') : fields;
    this.sql = `SELECT ${f}`;
    return this;
  }

  from(table: string) {
    this.sql += ` FROM ${table}`;
    return this;
  }

  where(condition: string, ...params: any[]) {
    this.sql += ` WHERE ${condition}`;
    this.params.push(...params);
    return this;
  }

  orderBy(field: string, dir: 'ASC' | 'DESC' = 'ASC') {
    this.sql += ` ORDER BY ${field} ${dir}`;
    return this;
  }

  limit(n: number) {
    this.sql += ` LIMIT ${n}`;
    return this;
  }

  toSQL() { return { sql: this.sql, params: this.params }; }
}

export class InsertBuilder {
  into(table: string, data: Record<string, any>) {
    const keys = Object.keys(data);
    const vals = Object.values(data);
    return { sql: `INSERT INTO ${table} (${keys.join(',')}) VALUES (${vals.map(() => '?').join(',')})`, params: vals };
  }
}
export default QueryBuilder;
