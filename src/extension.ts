import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('modularizer.formatModular', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const document = editor.document;
		const text = document.getText();
		const lang = document.languageId;

		let formatted = '';

		if (lang === 'lua' || lang === 'luau') {
			formatted = formatLua(text);
		} else if (lang === 'go') {
			formatted = formatGo(text);
		} else {
			vscode.window.showErrorMessage(`Language '${lang}' is not supported.`);
			return;
		}

		const fullRange = new vscode.Range(
			document.positionAt(0),
			document.positionAt(text.length)
		);

		editor.edit(editBuilder => {
			editBuilder.replace(fullRange, formatted);
		});
	});

	context.subscriptions.push(disposable);
}


function alignTables(code: string): string {
	const lines = code.split('\n');
	const output: string[] = [];

	let inTable = false;
	let tableLines: string[] = [];
	let tableIndent = '';

	for (const line of lines) {
		const trimmed = line.trim();

		if (trimmed.match(/^local\s+\w+\s*=\s*{$/)) {
			inTable = true;
			tableIndent = line.match(/^\s*/)?.[0] ?? '';
			output.push(line); // keep the original "local Table = {"
			continue;
		}

		if (inTable && trimmed === '}') {
			// Align table lines before closing
			const aligned = alignTableBlock(tableLines, tableIndent + '    ');
			output.push(...aligned);
			output.push(tableIndent + '}');
			tableLines = [];
			inTable = false;
			continue;
		}

		if (inTable) {
			tableLines.push(trimmed);
		} else {
			output.push(line);
		}
	}

	return output.join('\n');
}

function alignTableBlock(lines: string[], indent: string): string[] {
	const parts = lines.map(line => {
		const match = line.match(/^(\w+)\s*=\s*(.+),?$/);
		if (!match) return [line]; // non-standard line
		return [match[1], match[2].replace(/,$/, '')]; // [key, value]
	});

	const keyWidth = Math.max(...parts.map(p => p[0]?.length || 0));

	return parts.map(p => {
		if (p.length === 1) return indent + p[0]; // skip unparsed
		const [key, value] = p;
		return `${indent}${key.padEnd(keyWidth)} = ${value},`;
	});
}

function formatLua(text: string): string {
	const lines = text.split('\n');

	const Credits = `--[[

	Code-Modularizer — by YourPOV

	🔗 Contact:
	Discord   → @ruinedperception
	Instagram → @capalot.ecstasy
	Telegram  → @itsjusnix

	Much love,
	— YourPOV

--]]`;

	const output: string[] = [];
	const diagnostics: string[] = [];

	let insideFunction = false;
	let functionBlock: string[] = [];

	let insideTable = false;
	let tableBlock: string[] = [];
	let tableDepth = 0;

	let lastType: string | null = null;

	function insertHeader(type: string) {
		if (lastType !== type) {
			lastType = type;
			output.push('', '', sectionHeader(type), '');
		}
	}

	function sectionHeader(title: string): string {
		const dash = '─'.repeat(Math.max(0, 50 - title.length));
		return `-- / ── ${title} ${dash}`;
	}

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		if (trimmed.startsWith('--[[') && trimmed !== '--[[') continue;
		if (trimmed.startsWith('---@')) {
			diagnostics.push(line);
			continue;
		}

		// Detect function blocks
		if (insideFunction) {
			functionBlock.push(line);
			if (trimmed === 'end') {
				insertHeader('Functions');
				output.push(...functionBlock);
				functionBlock = [];
				insideFunction = false;
			}
			continue;
		}
		if (trimmed.startsWith('function') || trimmed.startsWith('local function')) {
			insideFunction = true;
			functionBlock = [line];
			continue;
		}

		// Detect full nested table blocks
		if (insideTable) {
			tableBlock.push(line);
			tableDepth += (trimmed.match(/{/g) || []).length;
			tableDepth -= (trimmed.match(/}/g) || []).length;

			if (tableDepth <= 0) {
				insertHeader('Tables');
				output.push(...tableBlock);
				tableBlock = [];
				insideTable = false;
				tableDepth = 0;
			}
			continue;
		}
		if (!insideTable && trimmed.match(/^local\s+\w+\s*=\s*{?/)) {
			insideTable = true;
			tableDepth = (trimmed.match(/{/g) || []).length - (trimmed.match(/}/g) || []).length;
			tableBlock = [line];
			continue;
		}

		// Detect metatables
		if (trimmed.match(/^setmetatable\(.+\{?/)) {
			insertHeader('Tables');
			output.push(line);
			continue;
		}

		// Services
		if (trimmed.match(/^local\s+\w+\s*=\s*game:GetService\(.+\)/)) {
			insertHeader('Services');
			output.push(line);
			continue;
		}

		// Libraries
		if (trimmed.match(/^local\s+\w+\s*=\s*(loadstring|getfenv|require)\b/)) {
			insertHeader('Libraries');
			output.push(line);
			continue;
		}

		// Variables
		if (trimmed.startsWith('local ') && trimmed.includes('=')) {
			insertHeader('Variables');
			output.push(line);
			continue;
		}

		// Everything else
		if (trimmed !== '') {
			insertHeader('Other');
			output.push(line);
		}
	}

	const final: string[] = [
		...(diagnostics.length ? diagnostics : ['---@diagnostic disable: undefined-global']),
		'',
		'',
		Credits,
		'',
		...output
	];

	const formatted = final.join('\n');
	return alignTables(formatted);
}



function formatGo(text: string): string {
	const lines = text.split('\n');

	const credits = `/*
	Code-Modularizer — by YourPOV

	This extension reformats Go and Lua code into structured,
	branded modules using a custom sectioned layout.

	Ideal for utilities, loaders, APIs, and backend tools with
	organized function flow and global structure.

	🔗 Contact:
	Discord   → @ruinedperception
	Instagram → @capalot.ecstasy
	Telegram  → @itsjusnix

	Much love,
	— YourPOV
*/`;

	const output: string[] = [];
	const imports: string[] = [];
	const variables: string[] = [];
	const functions: string[] = [];
	const others: string[] = [];

	let insideFunc = false;
	let funcBlock: string[] = [];

	for (let line of lines) {
		const trimmed = line.trim();

		if (insideFunc) {
			funcBlock.push(line);
			if (trimmed === '}') {
				functions.push(funcBlock.join('\n'));
				funcBlock = [];
				insideFunc = false;
			}
			continue;
		}

		if (trimmed.startsWith('func')) {
			insideFunc = true;
			funcBlock = [line.replace(/^func\s+/, 'func Module_')];
			continue;
		}

		if (trimmed.startsWith('package') || trimmed.startsWith('import')) {
			imports.push(line);
		} else if (trimmed.startsWith('var') || trimmed.startsWith('const')) {
			variables.push(line);
		} else if (trimmed !== '') {
			others.push(line);
		}
	}

	function header(title: string): string {
		const dash = '─'.repeat(Math.max(0, 50 - title.length));
		return `// ── ${title} ${dash}`;
	}

	const final: string[] = [credits];

	if (imports.length) {
		final.push('', '', header('Imports & Package'), '', ...imports);
	}
	if (variables.length) {
		final.push('', '', header('Global Variables'), '', ...variables);
	}
	if (functions.length) {
		final.push('', '', header('Functions'), '', functions.join('\n\n'));
	}
	if (others.length) {
		final.push('', '', header('Other Code'), '', ...others);
	}

	return final.join('\n');
}


export function deactivate() {}
