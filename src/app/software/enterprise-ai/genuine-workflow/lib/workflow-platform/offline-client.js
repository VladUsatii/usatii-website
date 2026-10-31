import { demoRequest } from '../../demo-transport';
const values=new Map();
const demoStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
const demoFetch=async(path,options)=>{try{const payload=await demoRequest(path,options);return {ok:true,status:200,json:async()=>payload};}catch(error){return {ok:false,status:400,json:async()=>({error:{message:error.message}})};}};
const STORAGE_KEY = "usatii.demo.offline-commands";
const MAX_COMMANDS = 500;

function read(storage) {
  try { const value = JSON.parse(storage?.getItem(STORAGE_KEY) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; }
}
function write(storage, commands) { storage?.setItem(STORAGE_KEY, JSON.stringify(commands)); }

export function listWorkFlowOfflineCommands(storage = demoStorage) { return read(storage); }

export function enqueueWorkFlowOfflineCommand(command, storage = demoStorage) {
  const commands = read(storage);
  if (commands.length >= MAX_COMMANDS) throw Object.assign(new Error("Offline Work Flow queue is full. Reconnect before making more changes."), { code: "OFFLINE_QUEUE_FULL" });
  const record = { id: command.id || crypto.randomUUID(), method: String(command.method || "POST").toUpperCase(), path: String(command.path || ""), body: command.body ?? null, observedRevision: command.observedRevision === null || command.observedRevision === undefined ? null : String(command.observedRevision), idempotencyKey: command.idempotencyKey || crypto.randomUUID(), createdAt: command.createdAt || new Date().toISOString(), attempts: 0, status: "queued", error: null };
  if (!record.path.startsWith("/api/work-flow/v1/")) throw Object.assign(new Error("Offline commands are limited to Work Flow APIs."), { code: "INVALID_OFFLINE_COMMAND" });
  commands.push(record); write(storage, commands); return record;
}

export function discardWorkFlowOfflineCommand(commandId, storage = demoStorage) { const commands = read(storage).filter((command) => command.id !== commandId); write(storage, commands); return commands; }

export async function replayWorkFlowOfflineCommands({ storage = demoStorage, fetcher = demoFetch, signal, onChange } = {}) {
  let commands = read(storage); const completed = [];
  for (const command of commands) {
    if (signal?.aborted) break;
    const headers = { "Content-Type": "application/json", "Idempotency-Key": command.idempotencyKey };
    if (command.observedRevision !== null) headers["X-Work-Flow-Revision"] = `"${command.observedRevision}"`;
    let response;
    try { response = await fetcher(command.path, { method: command.method, headers, body: command.body === null ? undefined : JSON.stringify(command.body), signal }); }
    catch (error) { command.attempts += 1; command.status = "queued"; command.error = { code: "NETWORK_ERROR", message: error.message }; write(storage, commands); onChange?.({ type: "network", command }); return { completed, remaining: commands, blocked: false, offline: true }; }
    const payload = await response.json().catch(() => ({}));
    if (response.ok) { completed.push(command.id); commands = commands.filter((entry) => entry.id !== command.id); write(storage, commands); onChange?.({ type: "completed", command, payload }); continue; }
    command.attempts += 1; command.error = payload.error || { code: "HTTP_ERROR", message: `Request failed with ${response.status}.` };
    command.status = [409, 412, 428].includes(response.status) ? "conflict" : response.status >= 500 ? "queued" : "failed";
    write(storage, commands); onChange?.({ type: command.status, command, payload });
    return { completed, remaining: commands, blocked: command.status === "conflict" || command.status === "failed", offline: false };
  }
  return { completed, remaining: commands, blocked: false, offline: false };
}

export const WORK_FLOW_OFFLINE_STORAGE_KEY = STORAGE_KEY;
