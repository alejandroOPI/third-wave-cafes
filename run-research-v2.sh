#!/bin/bash
# Background research script - will run for ~1 hour
# Results will be saved to research-v2-results.json

LOG="/Users/clawdius/clawd/third-wave-cafes/research-v2.log"
RESULT="/Users/clawdius/clawd/third-wave-cafes/research-v2-results.json"
PROMPT=$(cat /Users/clawdius/clawd/third-wave-cafes/research-prompt-v2.txt)

echo "[$(date)] Starting ChatGPT Pro deep research v2..." > "$LOG"

# Use the browser to run deep research
node << 'JSEOF' >> "$LOG" 2>&1
const WebSocket = require('ws');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runResearch() {
  // Open ChatGPT
  const http = require('http');
  
  const openTab = () => new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 18792,
      path: '/json/new?https://chat.openai.com',
      method: 'PUT'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });

  console.log('[' + new Date().toISOString() + '] Opening ChatGPT...');
  const tab = await openTab();
  console.log('[' + new Date().toISOString() + '] Tab opened:', tab.id);
  
  await sleep(8000); // Wait for page load
  
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  
  await new Promise(resolve => ws.on('open', resolve));
  console.log('[' + new Date().toISOString() + '] WebSocket connected');
  
  let msgId = 0;
  const send = (method, params) => {
    return new Promise((resolve) => {
      const id = ++msgId;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };
  
  // Wait for ChatGPT to fully load
  await sleep(5000);
  
  // Check if we need to select a model or if there's a textarea
  let result = await send('Runtime.evaluate', {
    expression: `document.querySelector('textarea, [contenteditable="true"]') ? 'ready' : 'waiting'`,
    returnByValue: true
  });
  console.log('[' + new Date().toISOString() + '] Page state:', result?.result?.value);
  
  // Try to find and click on the model selector to choose Deep Research
  await sleep(2000);
  
  const prompt = `I need comprehensive research on third-wave / specialty coffee shops for a babymoon trip in January 2026. This research must be EXHAUSTIVE and ORGANIZED BY NEIGHBORHOOD.

## DESTINATIONS & DATES:
1. **Paris, France** (Jan 6-10) - Organize by arrondissement (1st, 2nd, 3rd... 18th, 19th, 20th)
2. **Cortina d'Ampezzo, Italy** (Jan 10-13) - Small town, list any specialty options
3. **Switzerland stops** - Research coffee in: Zurich, Geneva, Lausanne, Bern, Basel, Lucerne
4. **Venice, Italy** (Jan 13-14) - Organize by sestiere (San Marco, Dorsoduro, Cannaregio, etc.)
5. **Milan, Italy** (Jan 14-16) - Organize by neighborhood (Brera, Navigli, Porta Venezia, Isola, Centrale, Duomo, etc.)

## FOR EACH COFFEE SHOP PROVIDE:
- Name, Full address, Neighborhood/Arrondissement
- Coordinates (latitude, longitude)
- Hours of operation
- Specialty (espresso, filter, cold brew, roastery)
- Instagram handle if known
- Notes (closed certain days, January hours)

## REQUIREMENTS:
- TRUE third-wave/specialty coffee only
- Include roasteries and flagship stores
- Note any closed in January
- Paris: 20+ cafes across arrondissements
- Milan: 10+ cafes across neighborhoods
- Switzerland: each city mentioned
- Venice: by sestiere

Output as organized JSON.`;

  // Type the prompt
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        const textarea = document.querySelector('textarea, [contenteditable="true"]#prompt-textarea');
        if (textarea) {
          if (textarea.tagName === 'TEXTAREA') {
            textarea.value = ${JSON.stringify(prompt)};
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            textarea.innerText = ${JSON.stringify(prompt)};
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
          return 'Prompt entered';
        }
        return 'No textarea found';
      })()
    `,
    returnByValue: true
  });
  
  console.log('[' + new Date().toISOString() + '] Prompt entered, waiting before submit...');
  await sleep(3000);
  
  // Look for Deep Research option or submit button
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        // Try to find and click Deep Research if available
        const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
        for (const btn of buttons) {
          if (btn.textContent.includes('Deep research') || btn.textContent.includes('Research')) {
            btn.click();
            return 'Clicked Deep Research';
          }
        }
        // Otherwise find send button
        const sendBtn = document.querySelector('button[data-testid="send-button"], button[aria-label="Send"]');
        if (sendBtn) {
          sendBtn.click();
          return 'Clicked Send';
        }
        return 'No button found';
      })()
    `,
    returnByValue: true
  });
  
  console.log('[' + new Date().toISOString() + '] Research started, monitoring for completion...');
  
  // Monitor for completion (check every 2 minutes for up to 60 minutes)
  for (let i = 0; i < 30; i++) {
    await sleep(120000); // 2 minutes
    
    const status = await send('Runtime.evaluate', {
      expression: `
        (function() {
          // Check if still generating
          const stopBtn = document.querySelector('button[aria-label="Stop generating"]');
          if (stopBtn) return 'generating';
          
          // Check for completed response
          const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
          if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            const text = lastMsg.innerText || lastMsg.textContent;
            if (text.length > 1000) {
              return 'DONE:' + text;
            }
          }
          return 'waiting';
        })()
      `,
      returnByValue: true
    });
    
    const val = status?.result?.value || '';
    console.log('[' + new Date().toISOString() + '] Status check ' + (i+1) + ': ' + val.substring(0, 50));
    
    if (val.startsWith('DONE:')) {
      const response = val.substring(5);
      require('fs').writeFileSync('/Users/clawdius/clawd/third-wave-cafes/research-v2-results.json', response);
      console.log('[' + new Date().toISOString() + '] Research complete! Saved to research-v2-results.json');
      break;
    }
  }
  
  ws.close();
  console.log('[' + new Date().toISOString() + '] Done');
}

runResearch().catch(err => console.error('Error:', err));
JSEOF

echo "[$(date)] Script finished" >> "$LOG"
