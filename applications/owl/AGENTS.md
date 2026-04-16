# Agent Documentation for Owl

## Account Filtering Gotcha

**IMPORTANT:** When filtering accounts by type, use the `type` query parameter on the `list` endpoint.

### Correct Approach

```
GET /owl/v1/accounts?type={account-type}
```

### Available Account Types

The `type` parameter accepts values from `AccountEntityType` enum:
- `user` — Regular user account
- `application` — Application account
- `application_admin` — Application admin account
- `platform_admin` — Platform admin account

### Example

```
GET /owl/v1/accounts?type=application
GET /owl/v1/accounts?type=user&offset=0&limit=20
```

### Why

Accounts only have `type` and `id` fields (no `name` or `email`). Searching by ID is counter-intuitive, so filtering by `type` is the sensible approach.

### Implementation Notes

1. Use existing `parseStringQueryParam` in controller
2. Pass filter to usecase: `{ offset, limit, filter: { type } }`
3. Base `MongoRepository.formatFilter()` handles the filter automatically

### Related PRs

- PR #4 (owl) — Correctly implements type filtering on list endpoint