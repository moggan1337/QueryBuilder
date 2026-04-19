# QueryBuilder

Type-safe SQL query builder for JS/TS.

## Usage
```typescript
new QueryBuilder()
  .select(['id', 'name'])
  .from('users')
  .where('age > ?', 18)
  .orderBy('name', 'ASC')
  .limit(10)
  .toSQL();
```
