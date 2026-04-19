# QueryBuilder 🏗️

**SQL Query Builder** - Type-safe, chainable.

## Features

- **🔗 Chainable** - Fluent API
- **📝 Type-safe** - Full TypeScript
- **🛡️ Sanitized** - SQL injection safe

## Installation

```bash
npm install querybuilder
```

## Usage

```typescript
import { QueryBuilder } from 'querybuilder';

// SELECT
const { sql, params } = new QueryBuilder()
  .select(['id', 'name', 'email'])
  .from('users')
  .where('age > ?', 18)
  .orderBy('name', 'ASC')
  .limit(10)
  .toSQL();

// INSERT
const insert = new InsertBuilder().into('users', { name: 'John', email: 'john@test.com' });
```

## API

| Method | Description |
|--------|-------------|
| `select(fields)` | SELECT fields |
| `from(table)` | FROM table |
| `where(condition, ...params)` | WHERE clause |
| `orderBy(field, dir)` | ORDER BY |
| `limit(n)` | LIMIT |
| `toSQL()` | Get SQL and params |

## License

MIT
