import { App, Editor, MarkdownFileInfo, MarkdownView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	deviceName: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	deviceName: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		/*const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');*/

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		/*const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');*/

		// This adds a simple command that can be triggered anywhere
		/*this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});*/ 
		// This adds an editor command that can perform some operation on the current editor instance

		// Register the context menu event
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
				menu.addItem((item) => {
					item
						.setTitle("Only show on current device")
						.onClick(() => {
							const selection = editor.getSelection();
							editor.replaceSelection(`\u200B\`\`$=if (dv.page("DeviceSettings").deviceName === "${this.settings.deviceName}") { dv.span("${selection}"); }else{ dv.span("");}\`\``);
						});
				});
			})
		);
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		/*this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}
					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});*/

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Update the YAML in a DeviceSettings file in the workspace
		const filePath = 'DeviceSettings/DeviceSettings.md'; // Replace with the actual relative path
		const file = this.app.vault.getAbstractFileByPath(filePath);
		
		if (file instanceof TFile) {
			console.log("Is Existing File");
			const content = await this.app.vault.read(file);
			const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
			
			if (frontmatter) {
				const updatedFrontmatter = {
					...frontmatter,
					deviceName: this.settings.deviceName
				};
				
				// Use JSON.stringify for YAML-like formatting
				const yamlString = JSON.stringify(updatedFrontmatter, null, 2).replace(/"/g, '');
				const updatedContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${yamlString}\n---`);
				
				await this.app.vault.modify(file, updatedContent);
			}
		}
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		// contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Device Name')
			.setDesc('Name your device')
			.addText(text => text
				.setPlaceholder('Enter your device name.')
				.setValue(this.plugin.settings.deviceName)
				.onChange(async (value) => {
					this.plugin.settings.deviceName = value;
					await this.plugin.saveSettings();
				}));
	}
}
