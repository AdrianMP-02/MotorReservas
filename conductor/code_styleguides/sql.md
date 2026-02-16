# SQL Style Guide - BookingCore-ES

## Database Engine
- **InnoDB**: Critical for ACID compliance and row-level locking.

## Best Practices
- **Explicit Locking**: Use `SELECT ... FOR UPDATE` only within transactions.
- **Indexes**: Mandatory index for any column used in `WHERE` clauses of high-concurrency queries.
- **Atomic Transactions**: Keep transactions as short as possible to prevent deadlocks.
- **Snake Case**: use `snake_case` for table and column names.
