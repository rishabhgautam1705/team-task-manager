# Auth system debugging & repair — TeamTask

## Backend
- [ ] Add required endpoints:
  - [ ] POST /api/auth/admin/register
  - [ ] POST /api/auth/admin/login
  - [ ] POST /api/auth/member/register
  - [ ] POST /api/auth/member/login
  - Keep existing /api/auth/register and /login working.
- [ ] Harden validation + role enforcement for these endpoints.
- [ ] Add end-to-end debug logging for auth flows (redact password) and bcrypt/JWT steps.
- [ ] Ensure error responses always return `{ success:false, message }` and proper status.

## Frontend
- [ ] Improve toast error messages to use backend `error.response.data.message` reliably.
- [ ] Add frontend console logs for payload/response.

## Mongo/Seeding
- [ ] Verify DB connect logs and ensure seed creates demo accounts.

## Verification (manual)
- [ ] Run server + frontend.
- [ ] Register Admin:
  - admin@teamtask.com / Admin@123
- [ ] Login Admin (same creds)
- [ ] Register Member:
  - member@teamtask.com / Member@123
- [ ] Login Member (same creds)
- [ ] Confirm no more generic “Login failed/Registration failed”.

