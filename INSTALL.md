# INSTALL (Local development)

## Frontend (React + Vite + Tailwind)
1. Open terminal -> `cd frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Build for production: `npm run build`

Frontend dev server expects API at `http://localhost:8000` by default. You can change base URL in `frontend/src/services/api.js`.

## Backend (PHP + MySQL)
1. Ensure PHP >= 7.4 and MySQL are installed.
2. Create database and import `/sql/fashion_company.sql`.
3. Update DB config in `backend/config/db.php`.
4. Serve backend with PHP built-in server for testing:
   `cd backend && php -S 0.0.0.0:8000`

## Notes
- Admin dashboard is located in `backend/admin/` and uses Tabler HTML templates (stub).
- Uploaded images go to `backend/uploads/`. Make sure it's writable by the webserver.
