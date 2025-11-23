# Backend Restart Instructions

Your backend appears to be hanging or crashed. Here's how to fix it:

## Step 1: Stop the Current Backend

1. Find the process:
   ```bash
   ps aux | grep uvicorn
   ```

2. Kill it:
   ```bash
   kill <PID>
   # Or if that doesn't work:
   kill -9 <PID>
   ```

## Step 2: Restart the Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

## Step 3: Test the Backend

In a new terminal, test if it's working:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test fund endpoint (this might take a few seconds)
curl http://localhost:8000/api/fund/VOO
```

## Common Issues Fixed:

1. **mstarpy date issue**: Fixed - now uses `date` objects instead of `datetime`
2. **Timeout issues**: Added limits (max 90 days of NAV data)
3. **Error handling**: Added better logging and error messages
4. **Startup logging**: Backend now prints status on startup

## If Backend Still Hangs:

1. Check the backend terminal for error messages
2. Make sure mstarpy is installed: `python3.10 -m pip install mstarpy`
3. Try a simple test: `python3.10 -c "import mstarpy; print('OK')"`

## Debug Mode:

If you want to see more detailed logs, the backend now prints:
- `[API]` - API endpoint calls
- `[get_fund_info]` - Fund data fetching
- `[get_fund_nav]` - NAV data fetching

Watch the backend terminal to see what's happening!

