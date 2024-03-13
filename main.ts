import { App, Setting, MarkdownView, Modal, Plugin } from 'obsidian';
import * as fs from 'fs';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

type onSumbitFunc = (projectName: string) => void;

export default class SecondBrain extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'create-new-project',
			name: 'Create a new project',
			callback: () => {
				new InputModal(this.app, async result => {
					let path = `1_projeto/${result}`;
					await this.app.vault.createFolder(path);
					await this.app.vault.create(`${path}/index.md`, '# Index');
					// console.log(`New project name: ${result}`)
				}).open();
			}
		});
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
		//
		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class InputModal extends Modal {
	projectName: string;
	onSubmit: onSumbitFunc;

	constructor(app: App, onSubmit: onSumbitFunc) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Create a new project" });

		new Setting(contentEl)
			.setName("Name")
			.addText((text) => {
				text.onChange(value => this.projectName = value);
			});

		new Setting(contentEl)
			.addButton(btn => {
				btn
					.setButtonText("Create")
					.setCta()
					.onClick(() => {
						this.close();
						this.onSubmit(this.projectName);
					});
			})

		this.scope.register([], "Enter", (evt: KeyboardEvent) => {
			if (evt.isComposing) { return; };

			this.close();
			this.onSubmit(this.projectName);
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
