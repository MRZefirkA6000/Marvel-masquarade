const TOKEN = "llc_5vPuLvb9p3Wpz6PoWWNC2IFJxDicFnXD5nQBZFUC";

export async function callMelty(toolName, args = {}) {
  const payload = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args
    }
  };

  const res = await fetch("https://melty.gg/api/mcp", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream"
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    return { raw: text, status: res.status };
  }
}

// CLI usage
const [tool, argsJson] = process.argv.slice(2);
if (tool) {
  const args = argsJson ? JSON.parse(argsJson) : {};
  callMelty(tool, args).then(r => console.log(JSON.stringify(r, null, 2)));
}
