// credits: https://github.com/nyable/obsidian-code-block-enhancer/blob/master/src/core.ts#L6:7
import { type MarkdownPostProcessorContext, type App, setIcon } from 'obsidian';
import LivecodesPlugin from "../main";
import { LANG_LIST } from '../settings/constants';
const LANG_REG = /^language-/;

export function codeBlockPostProcessor(
  element: HTMLElement,
  context: MarkdownPostProcessorContext,
  app: App,
  plugin: LivecodesPlugin
) {
  let lang = 'text';
  const code: HTMLPreElement = element.querySelector('pre:not(.frontmatter) > code') as HTMLPreElement;

  if (!code) return;

  if (!LANG_LIST.some(name => code.classList.contains(`language-${name}`))) {
    return;
  }

  code.classList.forEach((val, key) => {
    if (LANG_REG.test(val)) {
      lang = val.replace(`language-`, '');
      return;
    }
  });

  const pre = code.parentElement;

  if (pre?.parentElement?.querySelector(`div.open-with-livecodes-wrap`)) {
    return;
  }

  pre?.parentElement?.addClass(`open-with-livecodes-wrap`);

  const button = createEl('button', {cls:'open-with-livecodes-button'});
  button.setAttribute('aria-label', 'Open in livecodes');
	setIcon(button, "code");

  const buttonHanlder = async () => {
		plugin.settings.codeFragment = code.innerText;
		await plugin.activateView();
    document.querySelector('div[data-type="livecodes-view"] .workspace-tab-header-inner-close-button')?.addEventListener("click", (evt) => {
      evt.preventDefault();
    });
  };

  plugin.registerDomEvent(button, 'click', buttonHanlder);
  pre?.parentElement?.appendChild(button);
}