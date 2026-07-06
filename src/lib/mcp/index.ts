import { defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import getServiceTool from "./tools/get-service";
import submitLeadTool from "./tools/submit-lead";

export default defineMcp({
  name: "plan-b-asia-mcp",
  title: "Plan B Asia MCP",
  version: "0.1.0",
  instructions:
    "Tools for Plan B Asia / The Sovereign OS. Use `list_services` and `get_service` to browse advisory offerings (visas, relocation, wellness, expeditions). Use `submit_lead` to open a new advisory inquiry on the user's behalf.",
  tools: [listServicesTool, getServiceTool, submitLeadTool],
});
