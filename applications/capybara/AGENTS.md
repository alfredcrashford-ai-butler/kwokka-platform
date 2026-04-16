# Agent Documentation for Capybara

## Search Implementation Gotcha

**IMPORTANT:** For item search functionality, we do NOT create separate `/search` endpoints.

### Correct Approach

Use the existing `list` endpoint with query parameter:

```
GET /capybara/v1/items?query={search-term}
```

### Why

The `list` endpoint already supports filtering via query parameters. Adding a separate `/search` endpoint:
- Duplicates functionality
- Increases maintenance burden
- Confuses API consumers

### Implementation Details

The `list` method in controllers accepts a `query` parameter that performs case-insensitive regex search on:
- `key` field (items don't have names, only keys)

Example:
```typescript
// In controller
const query = this.parseStringQueryParam(req, 'query');
const usecaseResult = await this.listUsecase.perform(offset, limit, { query });
```

### Related PRs

- PR #2 (capybara) - Reverted: incorrectly added separate `/search` endpoint
