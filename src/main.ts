import { Plugin, TFile, PluginManifest, Notice } from 'obsidian';
import { LivecodesPluginSettingTab } from './settings';
import { TemplateSelectModal } from "./modals/template-select-modal";
import { LivecodesView, VIEW_TYPE_LIVECODES } from "./views/livecodes";
import { codeBlockPostProcessor } from './editor/postProcessor';

interface LivecodesPluginSettings {
	templateFolder: string;
	appUrl: string;
	fontFamily: string;
	fontSize: any;
	editor: string;
	lineNumbers: boolean;
	darkTheme: boolean;
	useTabs: boolean;
	tabSize: any;
	closeBrackets: boolean;
	semicolons: boolean;
	singleQuote: boolean;
	trailingComma: boolean;
	wordWrap: boolean;
	autoUpdate: boolean;
	delay: number;
	codeBlocks: boolean;
	template: TFile | null;
	codeFragment: string | undefined;
	dataHeight: any;
}

const DEFAULT_SETTINGS: LivecodesPluginSettings = {
	templateFolder: "livecodes",
	appUrl: "https://livecodes.io/",
	fontFamily: "Default",
	fontSize: "12",
	editor: "monaco",
	lineNumbers: true,
	darkTheme: true,
	useTabs: false,
	tabSize: "2",
	closeBrackets: true,
	semicolons: true,
	singleQuote: false,
	trailingComma: true,
	wordWrap: false,
	autoUpdate: true,
	delay: 1500,
	codeBlocks: true,
	template: null,
	codeFragment: undefined,
	dataHeight: "300"
}

export default class LivecodesPlugin extends Plugin {
	settings: LivecodesPluginSettings;
	params: any;
	fontFamily: any;
	fontSize: any;
	editor: any;
	lineNumbers: boolean;
	darkTheme: boolean;
	useTabs: boolean;
	tabSize: any;
	closeBrackets: boolean;
	semicolons: boolean;
	singleQuote: boolean;
	trailingComma: boolean;
	wordWrap: boolean;
	autoUpdate: boolean;
	delay: number = 1500;
	codeBlocks: boolean;
	d: any = new Date();
	state: string = 'initial';
	manifest: PluginManifest;
	template: TFile | null;
	codeFragment: string | undefined;
	dataHeight: string | undefined;
	logDebug: boolean = true;

	async onload() {
		this.state = "loading";

		this.addCommand({
			id: "open-template-select-modal",
			name: "Open template in livecodes",
			callback: async () => {
				new TemplateSelectModal(this).open();
			},
		});

		this.addCommand({
			id: "open-new-blank-project-livecodes",
			name: "New blank project in livecodes",
			callback: async () => {
				this.activateView();
			},
		});

		await this.loadSettings();
		this.addSettingTab(new LivecodesPluginSettingTab(this.app, this));

		this.registerView(
      VIEW_TYPE_LIVECODES,
      (leaf) => new LivecodesView(leaf, this)
    );
	
		const ribbonLivecodesIconEl = this.addRibbonIcon('code', 'Livecodes', (evt: MouseEvent) => {
			// this.activateView();
			new TemplateSelectModal(this).open();
		});
		ribbonLivecodesIconEl.addClass('livecodes-ribbon-class');

		if (this.settings.codeBlocks) {
			this.registerMarkdownPostProcessor((el, ctx) => {
				codeBlockPostProcessor(el, ctx, this.app, this);
			});			
		}
		/*/
		this.registerEvent(this.app.workspace.on('active-leaf-change', (e) => {
      // if (this.logDebug) console.log("%c---------------------------------------------------", 'color: crimson;');
      // if (this.logDebug) console.log("%cactive-leaf-change", 'color: crimson;');
      // if (this.logDebug) console.log(e?.getViewState())
    }));
		this.registerEvent(this.app.workspace.on('layout-change', () => {
			// callback: () => {}
			// return false;
      // if (this.logDebug) console.log("%c---------------------------------------------------", 'color: lime;');
      // if (this.logDebug) console.log("%clayout-change", 'color: lime;');
    }));
		/**/
		this.state = "loaded";
		console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_LIVECODES);
		this.state = "unloaded"
		console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
	}

  async activateView() {
		new Notice("Loading livecodes playground…", 5000);

    await this.app.workspace.getLeaf(true).setViewState({
      type: VIEW_TYPE_LIVECODES,
      active: true,
    });

    const leaf = this.app.workspace.getMostRecentLeaf();

    if (leaf?.view instanceof LivecodesView) {
	    this.app.workspace.revealLeaf(leaf);
		}
  }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * https://github.com/eoureo/obsidian-runjs/blob/master/src/main.ts#L1394
	 */
  async reload() {
    this.state = "start reloading";
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
    let manifest_id = this.manifest.id;
    // @ts-ignore
    if (this.app.plugins.enabledPlugins.has(manifest_id)) {
      this.state = "disable";
      // @ts-ignore
      await this.app.plugins.disablePlugin(manifest_id);

      window.setTimeout(async () => {
        // @ts-ignore
        this.app.plugins.enablePlugin(manifest_id);

        for (let i = 0; i < 100; i++) {
          // @ts-ignore
          let state = this.app.plugins.plugins[manifest_id]?.state;
          if (state == "loaded") {
            window.setTimeout(() => {
              // @ts-ignore
              this.app.setting.openTabById(manifest_id);
            }, 100);
            break;
          }
          await sleep(500);
        }
      }, 100);
    }
  }

	sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
