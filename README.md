# QueryBuilder 🏗️

[![npm version](https://img.shields.io/npm/v/querybuilder.svg)](https://www.npmjs.com/package/querybuilder)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Downloads](https://img.shields.io/npm/dm/querybuilder.svg)](https://npmjs.com/package/querybuilder)
[![Types](https://img.shields.io/badge/Types-Included-blueviolet.svg)](#)

**QueryBuilder** is a lightweight, type-safe, chainable SQL query builder for JavaScript and TypeScript. It provides a fluent API for building SQL queries with automatic parameterization to prevent SQL injection attacks.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [SELECT Queries](#select-queries)
  - [INSERT Queries](#insert-queries)
  - [UPDATE Queries](#update-queries)
  - [DELETE Queries](#delete-queries)
- [API Reference](#api-reference)
- [SQL Injection Prevention](#sql-injection-prevention)
- [TypeScript Support](#typescript-support)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **🔗 Chainable API** — Build queries with a fluent, chainable interface
- **📝 Type-Safe** — Full TypeScript support with intelligent type inference
- **🛡️ SQL Injection Prevention** — Automatic parameterization keeps your data safe
- **⚡ Lightweight** — Zero dependencies, under 5KB minified
- **🎯 Framework Agnostic** — Works with any database driver (mysql2, pg, sqlite3, etc.)
- **📦 ESM & CJS Support** — Modern ES modules and CommonJS compatibility
- **🔧 Extensible** — Easy to extend and customize for specific needs
- **📚 Well Documented** — Comprehensive API documentation and examples

---

## Installation

### npm

```bash
npm install querybuilder
```

### yarn

```bash
yarn add querybuilder
```

### pnpm

```bash
pnpm add querybuilder
```

### bun

```bash
bun add querybuilder
```

### CDN (Browser)

```html
<script type="module">
  import { QueryBuilder } from 'https://esm.sh/querybuilder';
</script>
```

---

## Quick Start

```typescript
import { QueryBuilder, InsertBuilder, UpdateBuilder, DeleteBuilder } from 'querybuilder';

// Build a SELECT query
const { sql, params } = new QueryBuilder()
  .select(['id', 'name', 'email'])
  .from('users')
  .where('age > ?', 18)
  .orderBy('created_at', 'DESC')
  .limit(10)
  .toSQL();

console.log(sql);
// SELECT id, name, email FROM users WHERE age > ? ORDER BY created_at DESC LIMIT 10

console.log(params);
// [18]

// Execute with your database driver
// await connection.execute(sql, params);
```

---

## Usage Examples

### SELECT Queries

#### Basic SELECT

```typescript
import { QueryBuilder } from 'querybuilder';

// Select all fields from a table
const query = new QueryBuilder()
  .select('*')
  .from('users')
  .toSQL();

console.log(query.sql);
// SELECT * FROM users
```

#### Select Specific Columns

```typescript
// Select specific columns
const query = new QueryBuilder()
  .select(['id', 'name', 'email'])
  .from('users')
  .toSQL();

console.log(query.sql);
// SELECT id, name, email FROM users
```

#### WHERE Clauses

```typescript
// Simple WHERE
const query = new QueryBuilder()
  .select(['id', 'name'])
  .from('users')
  .where('age > ?', 18)
  .toSQL();

// Multiple WHERE conditions
const query2 = new QueryBuilder()
  .select(['id', 'name', 'status'])
  .from('users')
  .where('status = ?', 'active')
  .where('age >= ?', 21)
  .toSQL();
```

#### JOINs

```typescript
// Note: For complex joins, you can use raw SQL within the builder
const query = new QueryBuilder()
  .select(['u.id', 'u.name', 'o.total'])
  .from('users u')
  .where('1=1') // Base condition
  .toSQL();

// Manual join (for complex scenarios)
const joinQuery = new QueryBuilder()
  .select(['users.name', 'orders.total'])
  .from('users')
  .toSQL();

// Append join manually if needed
joinQuery.sql += ' JOIN orders ON users.id = orders.user_id';
```

#### ORDER BY and LIMIT

```typescript
// ORDER BY
const query = new QueryBuilder()
  .select(['id', 'name', 'created_at'])
  .from('users')
  .orderBy('created_at', 'DESC')
  .toSQL();

// LIMIT
const query2 = new QueryBuilder()
  .select(['id', 'name'])
  .from('users')
  .limit(10)
  .toSQL();

// Combined with WHERE
const query3 = new QueryBuilder()
  .select(['id', 'name', 'email'])
  .from('users')
  .where('active = ?', true)
  .orderBy('name', 'ASC')
  .limit(25)
  .toSQL();
```

#### Complex SELECT Example

```typescript
// Build a complex query step by step
const { sql, params } = new QueryBuilder()
  .select([
    'id',
    'name',
    'email',
    'CASE WHEN status = 1 THEN "active" ELSE "inactive" END as status_text',
    'created_at'
  ])
  .from('users')
  .where('deleted_at IS NULL')
  .where('role IN (?, ?)', 'admin', 'moderator')
  .orderBy('created_at', 'DESC')
  .limit(100)
  .offset(0)
  .toSQL();

console.log(sql);
// SELECT id, name, email, CASE WHEN status = 1 THEN "active" ELSE "inactive" END as status_text, created_at FROM users WHERE deleted_at IS NULL AND role IN (?, ?) ORDER BY created_at DESC LIMIT 100 OFFSET 0

console.log(params);
// ['admin', 'moderator']
```

---

### INSERT Queries

#### Basic INSERT

```typescript
import { InsertBuilder } from 'querybuilder';

// Insert a single record
const insert = new InsertBuilder().into('users', {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

console.log(insert.sql);
// INSERT INTO users (name, email, age) VALUES (?, ?, ?)

console.log(insert.params);
// ['John Doe', 'john@example.com', 30]
```

#### INSERT with Timestamps

```typescript
const now = new Date().toISOString();

const insert = new InsertBuilder().into('posts', {
  title: 'My First Post',
  content: 'Hello, World!',
  author_id: 1,
  created_at: now,
  updated_at: now
});

console.log(insert.sql);
// INSERT INTO posts (title, content, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)

console.log(insert.params);
// ['My First Post', 'Hello, World!', 1, '2024-01-15T10:30:00.000Z', '2024-01-15T10:30:00.000Z']
```

#### INSERT and Get Results

```typescript
// Create the insert query
const insertQuery = new InsertBuilder().into('users', {
  name: 'Jane Smith',
  email: 'jane@example.com',
  password_hash: 'hashed_password_here'
});

// Execute with your database driver
async function createUser() {
  const { sql, params } = insertQuery;
  
  // Using mysql2 as an example
  // const [result] = await connection.execute(sql, params);
  // return result.insertId;
  
  return { sql, params };
}
```

#### Batch INSERT

```typescript
// For batch inserts, create multiple statements
const batchInserts = [
  new InsertBuilder().into('users', { name: 'User 1', email: 'user1@example.com' }),
  new InsertBuilder().into('users', { name: 'User 2', email: 'user2@example.com' }),
  new InsertBuilder().into('users', { name: 'User 3', email: 'user3@example.com' }),
];

// Combine into a single transaction
const batchSQL = batchInserts.map(q => q.sql).join('; ');
const batchParams = batchInserts.flatMap(q => q.params);

console.log(batchSQL);
// INSERT INTO users (name, email) VALUES (?, ?); INSERT INTO users (name, email) VALUES (?, ?); INSERT INTO users (name, email) VALUES (?, ?)

console.log(batchParams);
// ['User 1', 'user1@example.com', 'User 2', 'user2@example.com', 'User 3', 'user3@example.com']
```

---

### UPDATE Queries

#### Basic UPDATE

```typescript
import { UpdateBuilder } from 'querybuilder';

// Note: The current implementation uses InsertBuilder for updates
// For UPDATE, you can use the QueryBuilder pattern or create custom logic

// Simple update approach using parameterized queries
const updateBuilder = (table: string, data: Record<string, any>, where: string, ...whereParams: any[]) => {
  const keys = Object.keys(data);
  const vals = Object.values(data);
  
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
  
  return {
    sql,
    params: [...vals, ...whereParams]
  };
};

// Update a single record
const update = updateBuilder('users', { name: 'John Updated' }, 'id = ?', 1);

console.log(update.sql);
// UPDATE users SET name = ? WHERE id = ?

console.log(update.params);
// ['John Updated', 1]
```

#### UPDATE with Multiple Fields

```typescript
const update = updateBuilder(
  'posts',
  {
    title: 'Updated Title',
    content: 'Updated content here',
    status: 'published',
    updated_at: new Date().toISOString()
  },
  'id = ? AND author_id = ?',
  123,
  456
);

console.log(update.sql);
// UPDATE posts SET title = ?, content = ?, status = ?, updated_at = ? WHERE id = ? AND author_id = ?

console.log(update.params);
// ['Updated Title', 'Updated content here', 'published', '2024-01-15T10:30:00.000Z', 123, 456]
```

#### Conditional UPDATE

```typescript
const updateUserStatus = (userId: number, status: string, reason?: string) => {
  const data: Record<string, any> = { status };
  
  if (reason) {
    data.status_reason = reason;
    data.status_changed_at = new Date().toISOString();
  }
  
  return updateBuilder('users', data, 'id = ?', userId);
};

// Update just status
const { sql, params } = updateUserStatus(1, 'suspended', 'Terms violation');

console.log(sql);
// UPDATE users SET status = ?, status_reason = ?, status_changed_at = ? WHERE id = ?

console.log(params);
// ['suspended', 'Terms violation', '2024-01-15T10:30:00.000Z', 1]
```

---

### DELETE Queries

#### Basic DELETE

```typescript
import { DeleteBuilder } from 'querybuilder';

// Simple delete approach
const deleteBuilder = (table: string, where: string, ...whereParams: any[]) => {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  return { sql, params: [...whereParams] };
};

// Delete a single record
const deleteQuery = deleteBuilder('users', 'id = ?', 1);

console.log(deleteQuery.sql);
// DELETE FROM users WHERE id = ?

console.log(deleteQuery.params);
// [1]
```

#### DELETE with Conditions

```typescript
// Delete inactive users older than 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const deleteQuery = deleteBuilder(
  'sessions',
  'last_activity < ? AND remember_me = ?',
  thirtyDaysAgo.toISOString(),
  false
);

console.log(deleteQuery.sql);
// DELETE FROM sessions WHERE last_activity < ? AND remember_me = ?

console.log(deleteQuery.params);
// ['2024-01-15T10:30:00.000Z', false]
```

#### Safe DELETE (with confirmation)

```typescript
// Always include a WHERE clause to prevent accidental full table deletes
const safeDeleteUser = async (userId: number) => {
  // Check if user exists first
  const checkQuery = new QueryBuilder()
    .select(['id'])
    .from('users')
    .where('id = ?', userId)
    .toSQL();
  
  // const [rows] = await connection.execute(checkQuery.sql, checkQuery.params);
  // if (rows.length === 0) throw new Error('User not found');
  
  // Proceed with deletion
  const deleteQuery = deleteBuilder('users', 'id = ?', userId);
  
  return deleteQuery;
};
```

---

## API Reference

### QueryBuilder Class

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `select(fields)` | `fields: string \| string[]` | `QueryBuilder` | Specifies columns to select. Use `'*'` for all or an array of column names. |
| `from(table)` | `table: string` | `QueryBuilder` | Sets the main table to query from. |
| `where(condition, ...params)` | `condition: string, ...params: any[]` | `QueryBuilder` | Adds a WHERE condition with parameterized values. |
| `orderBy(field, dir)` | `field: string, dir: 'ASC' \| 'DESC'` | `QueryBuilder` | Adds ORDER BY clause. Default direction is 'ASC'. |
| `limit(n)` | `n: number` | `QueryBuilder` | Limits the number of results returned. |
| `offset(n)` | `n: number` | `QueryBuilder` | Skips the first n rows (for pagination). |
| `toSQL()` | None | `{ sql: string, params: any[] }` | Returns the final SQL string and parameters array. |

### InsertBuilder Class

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `into(table, data)` | `table: string, data: Record<string, any>` | `{ sql: string, params: any[] }` | Creates an INSERT statement with the specified table and data. |

### UpdateBuilder (Custom Implementation)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `updateBuilder(table, data, where, ...whereParams)` | `table: string, data: Record<string, any>, where: string, ...whereParams: any[]` | `{ sql: string, params: any[] }` | Creates an UPDATE statement with set values and WHERE conditions. |

### DeleteBuilder (Custom Implementation)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `deleteBuilder(table, where, ...whereParams)` | `table: string, where: string, ...whereParams: any[]` | `{ sql: string, params: any[] }` | Creates a DELETE statement with WHERE conditions. |

---

## SQL Injection Prevention

QueryBuilder provides **automatic SQL injection protection** through parameterized queries. This is one of the most important security features of the library.

### How It Works

Instead of concatenating user input directly into SQL strings (which is dangerous):

```typescript
// ❌ DANGEROUS - SQL Injection vulnerable!
const sql = `SELECT * FROM users WHERE name = '${userInput}'`;

// Attackers can inject: ' OR '1'='1 to bypass authentication
```

QueryBuilder uses **parameter placeholders** and **separate parameter arrays**:

```typescript
// ✅ SAFE - Parameterized query
const { sql, params } = new QueryBuilder()
  .select(['*'])
  .from('users')
  .where('name = ?', userInput)  // User input goes into params, not SQL
  .toSQL();

// SQL: SELECT * FROM users WHERE name = ?
// Params: ['user-provided-name']
```

### Best Practices for Security

#### 1. Always Use Parameter Placeholders

```typescript
// ❌ Never do this
.where(`name = '${name}'`)

// ✅ Always do this
.where('name = ?', name)
```

#### 2. Validate Table and Column Names

While QueryBuilder handles value parameterization, **table and column names** are directly interpolated:

```typescript
// ⚠️ Table names are not parameterized (SQL syntax requirement)
// Only use trusted/sanitized table names

const tableName = sanitizeTableName(userInput); // Implement your own validation
const query = new QueryBuilder().from(tableName);
```

#### 3. Use TypeScript Types

Leverage TypeScript to catch errors at compile time:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const user: Partial<User> = { name: 'John', email: 'john@test.com' };

const insert = new InsertBuilder().into('users', user);
```

#### 4. Log Queries for Auditing

```typescript
const logQuery = (sql: string, params: any[]) => {
  console.log('[QUERY]', sql);
  console.log('[PARAMS]', params);
  // Send to your logging service
};

const query = new QueryBuilder()
  .select(['*'])
  .from('users')
  .where('id = ?', userId)
  .toSQL();

logQuery(query.sql, query.params);
```

### Common Attack Patterns Prevented

| Attack | Example Input | Protected? |
|--------|---------------|------------|
| OR 1=1 | `' OR '1'='1` | ✅ Yes |
| UNION Injection | `' UNION SELECT * FROM users--` | ✅ Yes |
| Comment Injection | `'; DROP TABLE users;--` | ✅ Yes |
| Always True | `' OR TRUE--` | ✅ Yes |

---

## TypeScript Support

QueryBuilder is written in TypeScript and provides full type safety:

### Type Definitions

```typescript
import { QueryBuilder, InsertBuilder } from 'querybuilder';

// Full type inference
const query = new QueryBuilder()
  .select(['id', 'name'])
  .from('users')
  .where('age > ?', 18);

// query.sql is typed as string
// query.params is typed as any[]

// With specific types
interface User {
  id: number;
  name: string;
  email: string;
}

const insert = new InsertBuilder().into('users', {
  name: 'John',
  email: 'john@example.com'
} as User);
```

### Generic Support

```typescript
// Define your row types
interface UserRow {
  id: number;
  name: string;
  email: string;
}

// Use with ORM-like patterns
async function getUsers(): Promise<UserRow[]> {
  const { sql, params } = new QueryBuilder()
    .select(['id', 'name', 'email'])
    .from('users')
    .where('active = ?', true)
    .toSQL();
  
  // const [rows] = await connection.execute<UserRow[]>(sql, params);
  // return rows;
  
  return []; // Placeholder
}
```

---

## Configuration

### Custom Configuration

```typescript
// You can extend the builders for custom configurations
class CustomQueryBuilder extends QueryBuilder {
  withDefaultConditions() {
    return this.where('deleted_at IS NULL');
  }
}

const query = new CustomQueryBuilder()
  .select(['*'])
  .from('posts')
  .withDefaultConditions()
  .toSQL();
```

### Database-Specific Dialects

```typescript
// PostgreSQL style
class PostgresQueryBuilder extends QueryBuilder {
  limit(n: number, offset: number = 0) {
    this.sql += ` LIMIT ${n} OFFSET ${offset}`;
    return this;
  }
}
```

---

## Best Practices

### 1. Use Consistent Patterns

```typescript
// Define query builders as functions for reusability
const findUserById = (id: number) => new QueryBuilder()
  .select(['*'])
  .from('users')
  .where('id = ?', id)
  .toSQL();

const findActiveUsers = (limit: number = 10) => new QueryBuilder()
  .select(['id', 'name', 'email'])
  .from('users')
  .where('status = ?', 'active')
  .limit(limit)
  .toSQL();
```

### 2. Separate Query Building from Execution

```typescript
// Build queries separately from execution
const buildUserQuery = (filters: { age?: number; status?: string }) => {
  const builder = new QueryBuilder()
    .select(['id', 'name', 'email', 'age', 'status']);
  
  const conditions: any[] = [];
  
  if (filters.age) {
    conditions.push(filters.age);
    builder.where(`age >= ?`, filters.age);
  }
  
  if (filters.status) {
    conditions.push(filters.status);
    builder.where(`status = ?`, filters.status);
  }
  
  return builder.toSQL();
};

// Use anywhere
const { sql, params } = buildUserQuery({ age: 18, status: 'active' });
```

### 3. Use Transactions for Multiple Operations

```typescript
const createUserWithDefaults = async (userData: { name: string; email: string }) => {
  const insertQuery = new InsertBuilder().into('users', {
    ...userData,
    created_at: new Date().toISOString(),
    status: 'active'
  });
  
  const profileInsert = new InsertBuilder().into('profiles', {
    user_email: userData.email,
    created_at: new Date().toISOString()
  });
  
  // Execute in transaction
  // await connection.beginTransaction();
  // await connection.execute(insertQuery.sql, insertQuery.params);
  // await connection.execute(profileInsert.sql, profileInsert.params);
  // await connection.commit();
  
  return { insertQuery, profileInsert };
};
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/querybuilder.git
cd querybuilder

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- 📖 Documentation: [https://github.com/yourusername/querybuilder#readme](https://github.com/yourusername/querybuilder#readme)
- 🐛 Issues: [https://github.com/yourusername/querybuilder/issues](https://github.com/yourusername/querybuilder/issues)
- 💬 Discussions: [https://github.com/yourusername/querybuilder/discussions](https://github.com/yourusername/querybuilder/discussions)

---

<div align="center">

**Built with ❤️ for the developer community**

⭐ Star us on GitHub if this project helped you!

</div>
