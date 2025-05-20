# Code-Modularizer

**Code-Modularizer** Formats Lua and Go Code By adding branded headers and grouping related functions.

---

## 🚀 Features

- Adds headers for services, libraries, variables, functions, and more
- Supports Lua, Luau (Roblox), and Go

---

## 🕸️ Example

**Original:**
```lua
local replicatedStorage = game:GetService("ReplicatedStorage")
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

**Formatted:**
```lua
---@diagnostic disable: undefined-global


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