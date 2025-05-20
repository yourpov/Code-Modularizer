# Code-Modularizer

**Code-Modularizer** automates the transformation of Lua and Go scripts into modular, well-organized code. It adds branded headers, groups related functions, and can include your signature, all while preserving your code’s logic.

---

## 🚀 Features

- 🧠 **Smart Refactoring** — Keeps code logic and order intact
- 🧩 **Automatic Sectioning** — Adds headers for services, libraries, variables, functions, and more
- 🛠 **Multi-language** — Supports Lua, Luau (Roblox), and Go
- 🔒 **Safe** — Ensures functions are defined before use
- ✍️ **Custom Branding** — Optionally adds your credits

---

## 🖼️ Example

**Original:**
```lualocal replicatedStorage = game:GetService("ReplicatedStorage")
local players = game:GetService("Players")
local lighting = game:GetService("Lighting")
local httpService = game:GetService("HttpService")

local lib = loadstring(game:HttpGet("https://example.com/ui"))()
local version = "1.0.0"
local sessionId = httpService:GenerateGUID(false)

function log(text)
	print("[Astral]:", text)
end

function init()
	log("Initializing...")
	lib:Notify("Astral Loaded.")
end

function teleport(pos)
	local char = players.LocalPlayer.Character
	if char then char:MoveTo(pos) end
end

init()
teleport(Vector3.new(0, 150, 0))

```

**With Code-Modularizer:**
```lua---@diagnostic disable: undefined-global


--[[

	Code-Modularizer — by YourPOV

	🔗 Contact:
	Discord   → @ruinedperception
	Instagram → @capalot.ecstasy
	Telegram  → @itsjusnix

	Much love,
	— YourPOV

--]]


-- / ── Services ──────────────────────────────────────────

local replicatedStorage = game:GetService("ReplicatedStorage")
local players = game:GetService("Players")
local lighting = game:GetService("Lighting")
local httpService = game:GetService("HttpService")


-- / ── Libraries ─────────────────────────────────────────

local lib = loadstring(game:HttpGet("https://example.com/ui"))()


-- / ── Variables ─────────────────────────────────────────

local version = "1.0.0"
local sessionId = httpService:GenerateGUID(false)


-- / ── Functions ─────────────────────────────────────────

function log(text)
	print("[Astral]:", text)
end

function init()
	log("Initializing...")
	lib:Notify("Astral Loaded.")
end

function teleport(pos)
	local char = players.LocalPlayer.Character
	if char then char:MoveTo(pos) end
end


-- / ── Other ─────────────────────────────────────────────

init()
teleport(Vector3.new(0, 150, 0))

```

---

Let Code-Modularizer handle structure—focus on your logic!
