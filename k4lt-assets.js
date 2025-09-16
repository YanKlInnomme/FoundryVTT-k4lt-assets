import { setupSoundProtection } from "./modules/soundProtection.js";
import { registerSettings } from "./modules/settings.js";
import { addAIGeneratedNotice } from "./modules/settings.js";
import { checkForTheBlackMadonnaModule } from "./modules/MadonnaAdditional.js";
import { handleRenderJournalEntrySheet } from "./modules/MadonnaAdditional.js";

Hooks.once("ready", () => {
  kultLogger("Initializing k4lt-assets module");
  setupSoundProtection();
  registerSettings();
  checkForTheBlackMadonnaModule();
});

// Configuration of compendiums to hide
const COMPENDIUMS_TO_HIDE = [
    "k4lt-assets.additional-scenes--tbm",
    "k4lt-assets.additional-playlists--tbm"
];

// CSS selectors for Foundry v13
const COMPENDIUM_SELECTORS = [
    '.directory-item[data-pack="{collection}"]',
    '.directory-item[data-pack="{name}"]',
    '.compendium-pack[data-pack="{collection}"]',
    '.pack[data-pack="{collection}"]',
    'li[data-pack="{collection}"]'
];

/**
 * Hide a specific compendium from the user interface
 * @param {string} compendiumName - Name of the compendium to hide
 */
const hideCompendiumFromUI = (compendiumName) => {
    const compendium = game.packs.get(compendiumName);
    if (!compendium) {
        kultLogger(`Compendium ${compendiumName} not found`);
        return false;
    }
    
    let hidden = false;
    
    // Generate selectors with proper values
    const selectors = COMPENDIUM_SELECTORS.map(selector => 
        selector.replace('{collection}', compendium.collection)
                .replace('{name}', compendiumName)
    );
    
    selectors.forEach(selector => {
        const element = $(selector);
        if (element.length) {
            element.hide();
            hidden = true;
            kultLogger(`Compendium ${compendiumName} hidden from UI using selector: ${selector}`);
        }
    });
    
    if (!hidden) {
        kultLogger(`Could not find UI element for compendium: ${compendiumName}`);
    }
    
    return hidden;
};

/**
 * Hide all configured compendiums
 */
const hideAllConfiguredCompendiums = () => {
    kultLogger("Hiding configured compendiums from UI (data remains accessible)");
    
    COMPENDIUMS_TO_HIDE.forEach(compendiumName => {
        hideCompendiumFromUI(compendiumName);
    });
};

/**
 * Hide compendiums with delay handling
 */
const hideCompendiumsWithDelay = () => {
    // Try immediately
    hideAllConfiguredCompendiums();
    
    // Try with delay to ensure UI is loaded
    setTimeout(hideAllConfiguredCompendiums, 500);
};

// Main hook - hide compendiums when interface is ready
Hooks.once('ready', () => {
    hideCompendiumsWithDelay();
});

// Hook to re-hide compendiums if interface reloads
Hooks.on("renderCompendiumDirectory", () => {
    // Shorter delay since interface is already initialized
    setTimeout(hideAllConfiguredCompendiums, 100);
});

// Existing hooks (keep according to your needs)
Hooks.on("renderSettingsConfig", addAIGeneratedNotice);
Hooks.on("renderJournalEntrySheet", handleRenderJournalEntrySheet);

function getCurrentModuleId() {
  const path = import.meta.url;
  const match = path.match(/modules\/([^/]+)\//);
  return match ? match[1] : null;
}

const MODULE_ID = getCurrentModuleId();

function addModuleLinksToSettings(app, html) {
  const MODULE_ID = getCurrentModuleId();

  const accessSection = html.querySelector("section.access.flexcol");
  if (!accessSection) {
    console.error("No <section class='access flexcol'> found in parameters");
    return;
  }

  const section = document.createElement("section");
  section.classList.add("settings", "flexcol");

  section.innerHTML = `
    <h4 class="divider">${game.i18n.localize(`${MODULE_ID}.Module.Title`)}</h4>
  `;

  const linkKeys = [
    { icon: "fab fa-github", key: "Git" },
    { icon: "fa-regular fa-mug-hot fa-bounce", key: "Donation" }
  ];

  for (let i = 0; i < linkKeys.length; i++) {
    const link = linkKeys[i];
    const localizedText = game.i18n.localize(`${MODULE_ID}.Links.${link.key}Title`);
    const localizedURL = game.i18n.localize(`${MODULE_ID}.Links.${link.key}URL`);
    const linkSection = document.createElement("section");
    linkSection.classList.add("settings", "flexcol");

    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<i class="${link.icon}"></i> ${localizedText} <sup><i class="fa-light fa-up-right-from-square"></i></sup>`;

    button.addEventListener("click", ev => {
      ev.preventDefault();
      window.open(localizedURL, "_blank");
    });

    linkSection.appendChild(button);
    section.appendChild(linkSection);
  }

  accessSection.parentNode.insertBefore(section, accessSection.nextSibling);
}

Hooks.on("renderSettings", addModuleLinksToSettings);
