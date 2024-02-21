# Livecodes Playground

> [!IMPORTANT]
> 2024-02-21: project archived; New plugin here: [https://github.com/gapmiss/livecodes-playground](https://github.com/gapmiss/livecodes-playground)

## 🚧 W.I.P. pre-release BETA 🚧

<img src="https://livecodes.io/docs/img/livecodes-logo.svg" style="width:200px; margin: 0 auto;">

[Livecodes](https://livecodes.io/docs/overview) REPL playground plugin for [Obsidian.md](https://obsidian.md)

Read about [why Livecodes](https://livecodes.io/docs/why), it's [features](https://livecodes.io/docs/features/) and [how to self-host](https://livecodes.io/docs/features/self-hosting)

> ⚠️ Notice:
> The Livecodes codebase can be self-hosted but is not 100% off-line. Internet connection is required.

## Screenshots

### JavaScript REPL

![screenshot of JavaScript REPL](assets/CleanShot-Obsidian-(Livecodes%20-%20LIVECODES-PLUGIN%20-%20Obsidian%20v1.4.2)-20230806152651.png)

### Plugin settings

![screenshot of plugin settings](assets/CleanShot-Obsidian-(Livecodes%20-%20LIVECODES-PLUGIN%20-%20Obsidian%20v1.4.2)-20230806153030.png)

## Commands

1. `Livecodes: Open template in livecodes`
2. `Livecodes: New blank project in livecodes`

See starter templates here: [gapmiss/livecodes-for-obsidian/templates](https://github.com/gapmiss/livecodes-for-obsidian/tree/master/templates)

## Install

### via Release download

Download pre-release beta plugin from: [livecodes-for-obsidian-v0.1.0-beta.zip](https://github.com/gapmiss/livecodes-for-obsidian/releases/download/0.1.0-beta/livecodes-for-obsidian-v0.1.0-beta.zip) or [gapmiss/livecodes-for-obsidian/releases](https://github.com/gapmiss/livecodes-for-obsidian/releases)

Once downloaded to one's local machine, follow these steps to install:

1. extract the downloaded archive (`livecodes-for-obsidian-v0.1.0-beta.zip`)
2. move the extracted folder/directory to `/path/to/vault/.obsidian/plugins`
3. In **Obsidian settings** > **Community plugins**, enable the **Livecodes** plugin

### via BRAT (Beta Reviewer's Auto-update Tool)

1. Ensure [BRAT](https://github.com/TfTHacker/obsidian42-brat) is installed
2. Trigger the command `Obsidian42 - BRAT: Add a beta plugin for testing` 
3. Enter this repository, `gapmiss/livecodes-for-obsidian`
4. Enable *Livecodes* plugin in community plugin list

## Issues and bug reports

Please submit issues, bug reports, feature requests, etc. to [gapmiss/livecodes-for-obsidian/issues](https://github.com/gapmiss/livecodes-for-obsidian/issues)

## Development

1. `cd /path/to/vault/.obsidian/plugins`
2. `git clone https://github.com/gapmiss/livecodes-for-obsidian.git`
3. `cd livecodes-for-obsidian`
4. `npm install`
5. `npm run dev`
