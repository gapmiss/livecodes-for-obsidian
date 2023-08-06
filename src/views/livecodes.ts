import { ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile, Notice, PluginManifest } from 'obsidian';
import NavHeader from "./NavHeader";
import LivecodesPlugin from "../main";
import { openPromptModal } from "../modals/prompt-modal";
// @ts-ignore
import { createPlayground, config, Playground, EmbedOptions } from 'livecodes';

export const VIEW_TYPE_LIVECODES = "livecodes-view";

export class LivecodesView extends ItemView {

	plugin: LivecodesPlugin;
  navHeader: NavHeader;
  adapter: FileSystemAdapter;

  constructor(leaf: WorkspaceLeaf, plugin: LivecodesPlugin) {
    super(leaf);
		this.plugin = plugin;
    navHeader: NavHeader;
    this.adapter = plugin.app.vault.adapter as FileSystemAdapter;
  }

  getViewType() {
    return VIEW_TYPE_LIVECODES;
  }

  getDisplayText() {
    // let OBSIDIAN_BASE_PATH = (this.adapter as FileSystemAdapter).getBasePath();
    return "Livecodes";
  }

  async onOpen() {

    if (this.contentEl) {
			this.contentEl.empty();
		}

    let foundTemplate: boolean = (this.plugin.settings.template !== null);
    let newTemplate: Partial<config>;
    if (foundTemplate) {
      let tpl = await this.adapter.read(normalizePath((this.plugin.settings.template as TFile).path));
      newTemplate = JSON.parse(tpl) as Partial<config>;
    }
    const options: config = {
      appUrl: this.plugin.settings.appUrl,
      params: {
        // languages: "pyodide",
        autoupdate: this.plugin.settings.autoUpdate,
        delay: this.plugin.settings.delay,
        theme: this.plugin.settings.darkTheme ? "dark" : "light",
        fontFamily: this.plugin.settings.fontFamily,
        fontSize: Number(this.plugin.settings.fontSize),
        closeBrackets: this.plugin.settings.closeBrackets,
        trailingComma: this.plugin.settings.trailingComma,
        singleQuote: this.plugin.settings.singleQuote,
        semicolons: this.plugin.settings.semicolons,
        useTabs: this.plugin.settings.useTabs,
        tabSize: Number(this.plugin.settings.tabSize),
        console: "open", // or full
        lineNumbers: this.plugin.settings.lineNumbers,
        wordWrap: this.plugin.settings.wordWrap,
        editor: this.plugin.settings.editor,
        // autosave: true
      },
      // template: "javascript",
      loading: "eager",
    };

    let livecodesWrapper = this.contentEl.createDiv({cls:"livecodes-wrapper"});

    if (this.plugin.settings.dataHeight != "") {
      livecodesWrapper.setAttr("data-height", this.plugin.settings.dataHeight);
    }

    await createPlayground(livecodesWrapper, options).then( async (playground) => {
      if (foundTemplate) {
        await playground.setConfig( newTemplate );
        this.plugin.settings.template = null;
      }

      // todo: store temp codeFragment i.e. local-storage
      if (this.plugin.settings.codeFragment?.length! > 0) {
        const newConfig:Partial<config> = [
          {
            "activeEditor": "script",
            "markup": {
              "language": "html",
              "content": ""
            },
            "style": {
              "language": "css",
              "content": ""
            },
            "script": {
              "language": "javascript",
              "content": this.plugin.settings.codeFragment
            }
          }
        ];
        await playground.setConfig( newConfig[0] );
        this.plugin.settings.codeFragment = "";
      }

      this.navHeader = new NavHeader(this,livecodesWrapper);
      let a = this.navHeader.addAction(
        "share-2",
        "Share",
        async () => {
          const shareUrl = await playground.getShareUrl();
          await copyStringToClipboard(shareUrl, "Share URL");
        },
      );

      this.navHeader.addAction(
        "save",
        "Save as JSON template",
        async () => {
          const cfg = await playground.getConfig();
          let fName = await openPromptModal(this.app, "Livecodes", "Save template as:", "", "e.g. New Project", false);
          if (fName?.length === 0) {
            return;
          }
          let prettyCfg: string|undefined = JSON.stringify(cfg, null, 2);
          // await copyStringToClipboard(prettyCfg);
          try {
            await this.app.vault.create(
              this.plugin.settings.templateFolder+'/'+fName + ".json",
              await this.createText(
                prettyCfg
              )
            );
            new Notice("Template saved as: " + this.plugin.settings.templateFolder+'/'+fName + ".json");
          } catch (error) {
            new Notice(error);
          }

        }
      );

    });
  }

  getIcon(): string {
    return "code";
  }

  async createText(
		fileContent: string|undefined
	): Promise<string> {
		return fileContent?.trim() as string;
	}

}

/**
 * from: https://github.com/Obsidian-TTRPG-Community/TTRPG-Community-Admin/
 */
async function copyStringToClipboard(text:string, topic:string|undefined=undefined) {
  navigator.clipboard
      .writeText(text)
      .then(function () {
          new Notice((topic !== undefined ? topic + " " : "") + "Copied to clipboard", 2500);
      })
      .catch(function (error) {
          console.error('Failed to copy to clipboard: ', error)
      })
}
