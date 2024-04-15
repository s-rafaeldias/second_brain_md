import { App, Setting, Modal, Plugin } from 'obsidian';

interface SecondBrainSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: SecondBrainSettings = {
	mySetting: 'default'
}

// Custom types {{{
type onSumbitFunc = (projectName: string) => void;
// }}}

export default class SecondBrain extends Plugin {
	settings: SecondBrainSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'create-new-project',
			name: 'Create a new project',
			callback: () => {
				new InputModal(this.app, async result => {
					const indexPath = `1_projeto/${result}`;
					await this.app.vault.createFolder(indexPath);

					const indexFile = await this.app.vault.create(`${indexPath}/${result}.md`, '# Index');

					const leaf = this.app.workspace.getLeaf(false);
					await leaf.openFile(indexFile);
				}).open();
			},
		});

		// TODO: add context when creating a new note (use current note path to create on the same project)
		// TODO: add keyboard shortcut option for this command
		this.addCommand({
			id: 'create-new-note',
			name: 'Create a new note',
			callback: () => {
				// select which project
				// select note name
				// create new note (add some template for metadata info?)
			},
		});
	}

	onunload() { }

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

		this.scope.register([], "Enter", evt => {
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
