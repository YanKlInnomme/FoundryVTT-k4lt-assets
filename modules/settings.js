export function registerSettings() {
  // Vérifier si le module k4lt-the-black-madonna est activé
  const isModuleEnabled = game.modules.get("k4lt-the-black-madonna")?.active;

  // Si le module k4lt-the-black-madonna est activé, enregistrer les paramètres
  if (isModuleEnabled) {
        game.settings.register("k4lt-assets", "useAdditionalContent", {
            name: game.i18n.localize("k4lt-assets.Settings.useAdditionalContentName"),
            hint: game.i18n.localize("k4lt-assets.Settings.useAdditionalContentHint"),
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
            onChange: value => {
                kultLogger(`The answer to additional content is now : ${value}`);
                window.location.reload();
            }
        });

        game.settings.register("k4lt-assets", "hideAssetsDialog", {
            name: game.i18n.localize("k4lt-assets.Settings.hideAssetsDialogName"),
            hint: game.i18n.localize("k4lt-assets.Settings.hideAssetsDialogHint"),
            scope: "world",
            config: true, 
            type: Boolean,
            default: false,
            onChange: value => {
                kultLogger(`The answer to additional content is now : ${value}`);
                window.location.reload();
            }
        });
        } else {
        kultLogger("Module 'k4lt-the-black-madonna' is not active. Skipping settings registration.");
    }
}

export function addAIGeneratedNotice(app, html, data) {
  const target = html.querySelector('[name="k4lt-assets.hideAssetsDialog"]');
  if (!target) return;

  const section = document.createElement("div");
  section.className = "form-group k4lt-info-text";
  section.innerHTML = game.i18n.localize("k4lt-assets.Settings.AIGeneratedNotice");

  target.closest(".form-group").insertAdjacentElement("afterend", section);
}