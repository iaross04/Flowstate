# 🚀 Complete Setup & Testing Guide - Flowstate with Gemini

## ⚙️ Step-by-Step: Run the Program

### **Step 1: Open Terminal** (3 min)

#### On Windows:
1. Open File Explorer
2. Navigate to: `c:\xampp\htdocs\hackathon\Flowstate`
3. Right-click in the empty space → Select "Open in Terminal" (or PowerShell)

**OR** use keyboard shortcut:
- Press `Windows + R`
- Type: `cmd`
- Press Enter
- Type: `cd c:\xampp\htdocs\hackathon\Flowstate`
- Press Enter

---

### **Step 2: Install Dependencies** (2-3 min)

In the terminal, type:
```bash
npm install
```

**What this does:**
- Downloads all required packages (React, Next.js, Axios, etc.)
- Creates a `node_modules` folder
- You'll see lots of text - this is normal ✅

**Wait until you see:**
```
added XXX packages
```

---

### **Step 3: Verify API Key is Set** (1 min)

Check that `.env.local` has your Gemini API key:

**In the terminal, type:**
```bash
cat .env.local
```

**You should see:**
```
NEXT_PUBLIC_GEMINI_API_KEY=AlzaSyDs5gbVIOz8QCv3ss0wLckAoyFHA0i4xw0
```

If you don't see this, the key wasn't saved. Let me know and I'll fix it.

---

### **Step 4: Start the Development Server** (1 min)

In the terminal, type:
```bash
npm run dev
```

**You should see:**
```
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

✅ **The server is now running!** Don't close this terminal.

---

### **Step 5: Open the App in Browser** (1 min)

1. Open your web browser (Chrome, Edge, Firefox)
2. Type in address bar: `http://localhost:3000`
3. Press Enter

**You should see:**
- A clean, white background
- Title: "Flowstate"
- Text: "Smart Note Capture"
- An input field at the bottom saying "Write a note or task..."

✅ **The app is loaded!**

---

## 🧪 Step-by-Step: Test the Program

### **Test 1: Send Your First Message** (2 min)

1. Click in the input field (where it says "Write a note or task...")
2. Type: `Buy milk`
3. Click the blue send button (or press Enter)

**Wait 2-3 seconds...** (API is processing)

**You should see:**
- Your message appears as a blue bubble on the right
- Below it: AI response bubble with gray background
- Text: "Creating a to-do to buy groceries"

✅ **Success! Click the gray bubble to expand and see the JSON**

---

### **Test 2: Expand the Result** (1 min)

1. Click on the gray AI response bubble
2. You should see it expand showing:
   - **Category badge**: "✓ Task" with orange dot
   - **Path**: `Tasks/Shopping/groceries.md`
   - Metadata section showing details

✅ **You can see the AI's decisions!**

---

### **Test 3: View the Raw JSON** (1 min)

1. Keep the result expanded from Test 2
2. Scroll down in the expanded section
3. Look for "⚙️ Raw JSON" section
4. You should see:
```json
{
  "category": "To-Do",
  "path": "Tasks/Shopping/groceries.md",
  "content": "---\ndate_created: ...",
  "summary": "Creating a to-do to buy groceries"
}
```

✅ **This is the JSON that will go to Pat's backend!**

---

### **Test 4: Copy JSON to Clipboard** (1 min)

1. Still in the expanded result
2. Find the "Copy JSON" button
3. Click it
4. You should see a brief confirmation

✅ **The JSON is now copied and can be pasted**

---

### **Test 5: Send More Messages to Test** (5 min)

Try these different types of messages to see how the AI categorizes them:

#### Test Message 1: Simple Task
```
Send: "Call Mom tomorrow at 3pm"
```
Expected: To-Do, Tasks/[something], has tags

#### Test Message 2: Technical Reference
```
Send: "React hooks documentation - useEffect tutorial"
```
Expected: Reference, Reference/Coding/React/, coding-related tags

#### Test Message 3: Multi-Intent (Task + Context)
```
Send: "Remind me to check gas prices because they're rising at 65 pesos"
```
Expected: To-Do, Tasks/Finance/, includes context in content

#### Test Message 4: Shopping Task
```
Send: "Buy eggs, butter, and milk for breakfast"
```
Expected: To-Do, Tasks/Shopping/, grocery tags

#### Test Message 5: Python Learning
```
Send: "Python async/await patterns explained"
```
Expected: Reference, Reference/Coding/Python/, python tags

---

## ✅ Complete Verification Checklist

### UI/Display ✅
- [ ] App loads with white background (Light Mode)
- [ ] Title says "Flowstate"
- [ ] Input field is visible at bottom
- [ ] Send button appears (blue circle)

### Message Sending ✅
- [ ] Can type in input field
- [ ] Send button is clickable
- [ ] Message appears as blue bubble on right
- [ ] Loading animation shows while processing

### AI Response ✅
- [ ] AI response appears as gray bubble on left
- [ ] Response contains a plain English summary
- [ ] Response bubble can be clicked to expand
- [ ] Expanded view shows metadata section
- [ ] Category badge shows (✓ Task or 📌 Reference)
- [ ] Path is displayed
- [ ] Expandable sections work

### JSON Output ✅
- [ ] Raw JSON section is visible when expanded
- [ ] JSON has all 4 required fields:
  - [ ] category: "To-Do" or "Reference"
  - [ ] path: e.g., "Tasks/Shopping/groceries.md"
  - [ ] content: markdown with YAML frontmatter
  - [ ] summary: plain English explanation
- [ ] Copy JSON button works
- [ ] YAML frontmatter includes:
  - [ ] date_created (ISO format)
  - [ ] source: "Mobile-Chat"
  - [ ] tags: [auto-generated]

### Categorization ✅
- [ ] Action words (buy, fix, call) → To-Do
- [ ] Information words (tutorial, article) → Reference
- [ ] Mentions of "React" → Reference/Coding/React/
- [ ] Mentions of "Python" → Reference/Coding/Python/
- [ ] Mentions of shopping → Tasks/Shopping/
- [ ] Tags are relevant and lowercase

### No Errors ✅
- [ ] No red error messages in app
- [ ] No errors in browser console (F12 → Console tab)
- [ ] Terminal shows no warnings

---

## 🆘 Troubleshooting

### "Address already in use" error in terminal

**Problem:** Port 3000 is already being used

**Solution:**
```bash
npm run dev -- -p 3001
```

Then open: `http://localhost:3001`

---

### App loads but shows blank page

**Problem:** API key issue or page didn't load properly

**Solution:**
1. Press `Ctrl + Shift + Delete` (Clear browser cache)
2. Close browser completely
3. Reopen and go to `http://localhost:3000`
4. If still blank, stop terminal (`Ctrl + C`) and restart: `npm run dev`

---

### Message sent but no response (hangs/loading)

**Problem:** API key is invalid or Gemini API down

**Solution:**
1. Check `.env.local` has the correct API key
2. Look at terminal - any error messages?
3. Open browser DevTools (F12) → Console tab → any red errors?
4. If key is wrong, I can update it

---

### JSON looks wrong or malformed

**Problem:** Gemini API returned invalid JSON format

**Solution:**
1. Take a screenshot
2. Tell me the message you sent
3. Tell me what the JSON output was
4. I can adjust the prompt

---

### Can't open terminal in the Flowstate folder

**Alternative method:**
1. Press `Windows + R`
2. Type: `powershell`
3. In PowerShell, type: `cd c:\xampp\htdocs\hackathon\Flowstate`
4. Then: `npm install`
5. Then: `npm run dev`

---

## 📊 What's Happening Behind the Scenes

When you send a message:

```
You type message
    ↓
Browser sends to: http://localhost:3000/api (POST request)
    ↓
Backend receives message
    ↓
Adds your message to a special prompt
    ↓
Sends to Google Gemini API
    ↓
Gemini processes with 5-rule logic
    ↓
Returns JSON:
  {
    category: "To-Do" or "Reference",
    path: "suggested/folder/path.md",
    content: "markdown with frontmatter",
    summary: "plain English explanation"
  }
    ↓
Receives JSON response
    ↓
Displays in chat UI
    ↓
Shows summary to you
    ↓
You can expand to see full JSON
    ↓
Later, Pat's backend will save this JSON to Obsidian
```

---

## 🎯 Quick Reference While Testing

| Want to | Do this |
|---|---|
| Stop the server | Press `Ctrl + C` in terminal |
| Restart the server | Stop it, then run `npm run dev` again |
| View browser errors | Press `F12`, click "Console" tab |
| View server errors | Look at the terminal window |
| Change API key | Edit `.env.local` and restart server |
| Clear all messages | Refresh browser (F5) |
| Check if API key works | Look for "Gemini API key not configured" error |

---

## 📝 Recording Your Test Results

**Create a simple test log:**

```
Test 1: "Buy milk"
- Category: To-Do ✓
- Path: Tasks/Shopping/groceries.md ✓
- Tags: [#grocery, #shopping] ✓
- Status: PASS ✓

Test 2: "React tutorial"
- Category: Reference ✓
- Path: Reference/Coding/React/... ✓
- Tags: [#react, #javascript] ✓
- Status: PASS ✓

...etc
```

Share this with me if something looks wrong!

---

## ✨ Success Criteria

You know everything is working when:

✅ App loads without errors  
✅ You can type and send messages  
✅ AI responds with category, path, and tags  
✅ JSON output is valid and complete  
✅ Multiple message types work correctly  
✅ No red errors in browser or terminal  

---

## 🚀 Next Steps After Testing

1. **Send me the results** - Tell me which tests passed/failed
2. **If all pass** - Code is ready for Pat's integration!
3. **If something fails** - Send screenshot + error message, I'll fix it
4. **Ready to deploy** - Follow DEPLOYMENT.md guide

---

## 💡 Pro Tips

- **Test multiple times** - Send 5-10 different messages to see patterns
- **Watch the JSON** - It tells you exactly what the AI decided
- **Look for tags** - They should match the message content
- **Check paths** - They should match the message category
- **Note errors** - Take screenshots if something breaks

---

**You're ready to test! Follow the steps above and let me know how it goes! 🎉**

**Questions? I'm here to help.**
