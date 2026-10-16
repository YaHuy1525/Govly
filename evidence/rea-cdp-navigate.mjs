// Navigate the debug browser to the investigation target so REA's passive
// capture window covers a fresh page load. Read-only: Page.enable +
// Network.enable + Page.navigate to the same URL the browser was launched with.
const targets = await (await fetch("http://127.0.0.1:9222/json")).json();
const page = targets.find(t => t.type === "page" && t.url.includes("holisticai.com"));
if (!page) { console.error("no page target"); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
let done = false;
ws.onopen = () => {
  ws.send(JSON.stringify({id: 1, method: "Page.enable"}));
  ws.send(JSON.stringify({id: 2, method: "Network.enable"}));
  ws.send(JSON.stringify({id: 3, method: "Page.navigate", params: {url: "https://www.holisticai.com/"}}));
};
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === "Page.loadEventFired" && !done) {
    done = true;
    console.log("load event fired");
    setTimeout(() => { ws.close(); process.exit(0); }, 2500);
  }
};
setTimeout(() => { console.log("timeout (no load event)"); process.exit(2); }, 45000);
