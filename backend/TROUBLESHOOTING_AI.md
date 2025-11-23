# Troubleshooting AI Analysis Unavailable

## Quick Fixes

### 1. **Restart Your Backend Server**

The backend server might have crashed or stopped responding. Restart it:

```bash
cd backend
# Stop the current server (Ctrl+C if running)
# Then restart:
uvicorn main:app --reload --port 8000
```

### 2. **Check if Backend is Running**

Test if the backend is accessible:

```bash
curl http://localhost:8000/health
```

You should see:
```json
{"status": "ok", "gemini_configured": true}
```

### 3. **Check Browser Console**

Open your browser's Developer Console (F12) and look for:
- Connection errors
- API call failures
- Error messages

### 4. **Check Backend Logs**

Look at the terminal where your backend is running. You should see:
- `[generate_investor_report] Request received...`
- `[generate_investor_report] Calling Gemini API...`
- Any error messages

## Common Issues

### Issue: "Cannot connect to backend"
**Solution**: Make sure the backend is running on port 8000
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Issue: "Gemini API key not configured"
**Solution**: Check your `.env` file in the `backend/` directory has:
```
GEMINI_API_KEY=your-actual-api-key
```

### Issue: "Backend error: 500"
**Solution**: Check the backend terminal for error messages. Common causes:
- Gemini API key invalid
- Network issues
- Import errors

### Issue: "AI report unavailable. Try again later."
**Solution**: 
1. Check backend is running
2. Check browser console for errors
3. Check backend terminal for error messages
4. Verify Gemini API key is set

## Testing the Backend

Test the endpoint directly:

```bash
curl -X POST http://localhost:8000/generate_investor_report \
  -H "Content-Type: application/json" \
  -d '{
    "personality": {
      "code": "SLCH",
      "name": "Test",
      "description": "Test description"
    },
    "scores": {
      "shortTermVsLongTerm": 2.0,
      "highRiskVsLowRisk": -1.0,
      "clarityVsComplexity": 0.0,
      "consistentVsLumpSum": 1.0
    },
    "role": "investor"
  }'
```

## What to Check

1. ✅ Backend server is running (`uvicorn main:app --reload`)
2. ✅ Backend is accessible on port 8000
3. ✅ Gemini API key is set in `backend/.env`
4. ✅ No errors in backend terminal
5. ✅ No CORS errors in browser console
6. ✅ Frontend is calling the correct URL (`http://localhost:8000`)

## Debug Steps

1. **Check backend health:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check browser console** for API call errors

3. **Check backend terminal** for request logs and errors

4. **Test the endpoint directly** with curl (see above)

5. **Check network tab** in browser DevTools to see the actual request/response

