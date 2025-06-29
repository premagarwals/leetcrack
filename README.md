# LeetCrack

**LeetCrack** is a browser extension that helps you practice LeetCode questions by company and difficulty, with a built-in timer and progress tracking. It's designed for interview prep, daily grind, and a little bit of fun.  
> _Yes, it's vibecoded.™️_

---

## Features

- Select company-specific LeetCode questions
- Choose number of Easy/Medium/Hard problems
- Set a custom timer for your session
- Track solved questions (auto-hides solved ones)
- "Leave Test" button to reset anytime
- Clean, focused UI

---

# 🚀 Installation Guide (How to Use LeetCrack)

**Pick your browser below and follow the steps. Just copy-paste the commands into your terminal!**

---

## 🦊 Firefox (and Zen etc.)

1. **Download the Extension Files**

   Open your terminal and run:
   ```sh
   git clone https://github.com/premagarwals/leetcrack.git
   cd leetcrack
   ```
   **Note:**  
   in this folder, rename the `manifest-firefox.json` to `manifest.json`, replacing the original one.

2. **Load the Extension in Firefox**

   - Open Firefox.
   - In the address bar, type: `about:debugging#/runtime/this-firefox` and press Enter.
   - Click **"Load Temporary Add-on..."**.
   - In the file dialog, go to the `leetcrack` folder and select the `manifest.json` file.

3. **Done!**
   - The LeetCrack icon should now appear in your browser toolbar.
   - Click it to start using.

---

## 🟦 Chrome (and Edge, Brave, Chromium, etc.)

1. **Download the Extension Files**

   Open your terminal and run:
   ```sh
   git clone https://github.com/premagarwals/leetcrack.git
   cd leetcrack
   ```

2. **Load the Extension in Chrome**

   - Open Chrome.
   - In the address bar, type: `chrome://extensions/` and press Enter.
   - At the top right, turn on **Developer mode** (toggle switch).
   - Click **"Load unpacked"**.
   - In the dialog, select the `leetcrack` folder (the one containing `manifest.json`).

3. **Done!**
   - The LeetCrack icon should now appear in your browser extension area.
   - Click it to start using.

---

## ⚠️ Troubleshooting

- **Solved questions not detected in Chrome?**  
  Refresh your LeetCode tab after installing or reloading the extension, or open a new LeetCode tab.

- **Firefox error about `service_worker` or manifest version?**  
  Use the provided `manifest-firefox.json` (rename it to `manifest.json` before loading).

---

## 📝 Usage

1. Click the LeetCrack icon in your browser.
2. Select your target company.
3. Choose how many Easy, Medium, and Hard questions you want.
4. Set your desired time (hours, minutes, seconds).
5. Click **Generate Set**.
6. Solve questions, track your progress, and vibe.

If you want to leave the test early, just hit **Leave Test**.

---

## FAQ

**Q: Is my LeetCode account safe?**  
A: Yes! The extension only reads your solved questions to avoid repeats. It does not store or transmit your credentials.

**Q: Can I use this on Edge or Brave?**  
A: Yes! Any Chromium-based browser that supports extensions should work. Just use the Chrome instructions above.

**Q: Why is it called vibecoded?**  
A: Because it was coded with vibes, not just specs. Enjoy the grind!

---

## Support

If you have issues or suggestions, open an issue or PR on GitHub.

---

**Happy grinding!**  
_LeetCrack: It's not just coded, it's vibecoded._