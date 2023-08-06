import LivecodesPlugin from "../main";
import {
	FileSystemAdapter,
	FuzzyMatch,
	FuzzySuggestModal,
	Notice,
	TFile,
	TFolder,
	Vault
} from "obsidian";

export const TEMPLATE_FORMATS = [
	"json"
];

export class TemplateSelectModal extends FuzzySuggestModal<TFile> {
	plugin: LivecodesPlugin;
	vault: Vault;
	adapter: FileSystemAdapter;

	constructor(plugin: LivecodesPlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.vault = plugin.app.vault;
		this.adapter = plugin.app.vault.adapter as FileSystemAdapter;
		this.containerEl.addClass("template-select-modal");
		this.setPlaceholder("Select a template or type to search");
	}

	getItems(): TFile[] {
		const templateFolder = this.plugin.settings.templateFolder;
		const folder = this.vault.getAbstractFileByPath(templateFolder);
		if (!folder || !(folder instanceof TFolder)) {
			new Notice(
				createFragment((frag) => {
					frag.appendText(" ❗ ERROR ❗\n'"+templateFolder+"'");
					frag.appendText(" is not a valid folder in the plugin settings.");
				}),
				0
			);
			this.close();
			return [];
		}
		return this.getTemplatesInFolder(folder);
	}

	getItemText(item: TFile): string {
		return item.name	;
	}

	renderSuggestion(match: FuzzyMatch<TFile>, el: HTMLElement) {
		super.renderSuggestion(match, el);
	}

	async onChooseItem(f: TFile) {
		if (f.path) {
			this.plugin.settings.template = f;
			this.plugin.activateView();
			return Promise.resolve;
		} else {
			new Notice("Invalid file path.")
			console.log(`Invalid file path: ${f.path}`);
			return Promise.reject;
		}
	}

	private getTemplatesInFolder(folder: TFolder): TFile[] {
		const files: TFile[] = [];
		folder.children.forEach((abFile) => {
			const file = abFile as TFile;
			if (TEMPLATE_FORMATS.includes(file.extension)) {
				files.push(file);
			}
		});
		return files.sort( (a,b) => {
			return a.name.localeCompare(b.name);
		});
	}

}
