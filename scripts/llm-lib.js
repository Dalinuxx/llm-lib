/*
 * Class that holds constants - not the API key?
 */
class llmSettings {
  static ID = "llm-lib";

  static SETTINGS = {
    API_KEY: "api_key",
    USE_API_KEY: "use_api_key",
    SECRET_KEY: "secret_key",
    KEYS: "keys",
    GOOGLE_CLOUD_API_KEY: "google_cloud_api_key"
  };

  static TEMPLATES = {
    CHATBOT: `modules/${this.ID}/templates/llm-lib.hbs`,
  };

  /**
   * A small helper function which leverages developer mode flags to gate debug logs.
   *
   * @param {boolean} force - forces the log even if the debug flag is not on
   * @param  {...any} args - what to log
   */
  static log(force, ...args) {
    const shouldLog =
      force ||
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(this.ID, "|", ...args);
    }
  }

  static initialize() {
    this.llmSettings = new llmSettings();

    game.settings.register(this.ID, this.SETTINGS.API_KEY, {
      name: `CHAT-BOT.settings.${this.SETTINGS.API_KEY}.Name`,
      default: "",
      type: String,
      scope: "world",
      config: false,
      hint: `CHAT-BOT.settings.${this.SETTINGS.API_KEY}.Hint`,
      onChange: () => {},
      restricted: true,
    });

    game.settings.register(this.ID, this.SETTINGS.USE_API_KEY, {
        name: `CHAT-BOT.settings.${this.SETTINGS.USE_API_KEY}.Name`,
        default: false,
        type: Boolean,
        scope: "world",
        config: true,
        restricted: true,
        hint: `CHAT-BOT.settings.${this.SETTINGS.USE_API_KEY}.Hint`
    });

    game.settings.register(this.ID, this.SETTINGS.SECRET_KEY, {
        name: `CHAT-BOT.settings.${this.SETTINGS.SECRET_KEY}.Name`,
        default: "",
        type: String,
        inputType: 'password',
        scope: "world",
        config: false,
        hint: `CHAT-BOT.settings.${this.SETTINGS.SECRET_KEY}.Hint`,
        restricted: true,
    });

    // Setting for Google Cloud API Key
    game.settings.register(this.ID, this.SETTINGS.GOOGLE_CLOUD_API_KEY, {
      name: `CHAT-BOT.settings.${this.SETTINGS.GOOGLE_CLOUD_API_KEY}.Name`,
      default: "",
      type: String,
      scope: "world",
      config: false,
      hint: `CHAT-BOT.settings.${this.SETTINGS.GOOGLE_CLOUD_API_KEY}.Hint`,
      restricted: true,
    });
  }
}

/**
 * Register our module's debug flag with developer mode's custom hook
 */
Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(llm.ID);
});

/*
 *
 */

class llmLib {
    static async callLlm(llmQuery) {
        const GOOGLE_CLOUD_API_KEY = game.settings.get(llmSettings.ID, llmSettings.SETTINGS.GOOGLE_CLOUD_API_KEY);
        // Assuming the Gemini API endpoint is known
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-exp-1206:generateContent?key=${GOOGLE_CLOUD_API_KEY}`;

        // Adapt the prompt to match Gemini's expected format
        const data = {
            contents: [{
                role: "user",
                parts: [{ text: llmLib.helpfulAssistant + " " + llmQuery }]
            }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            // Adapt the response to match the previous structure
            // This is a placeholder, you'll need to adjust based on actual Gemini response
            let actorData = {
                "npc": {
                    "name": "Generated NPC",
                    "type": "npc",
                    "system": {
                        "abilities": {
                            "str": { "value": "10", "proficient": "0" },
                            "dex": { "value": "10", "proficient": "0" },
                            "con": { "value": "10", "proficient": "0" },
                            "int": { "value": "10", "proficient": "0" },
                            "wis": { "value": "10", "proficient": "0" },
                            "cha": { "value": "10", "proficient": "0" }
                        },
                
                        "skills": {
                            "acr": { "value": "0" },
                            "ani": { "value": "0" },
                            "arc": { "value": "0" },
                            "ath": { "value": "0" },
                            "dec": { "value": "0" },
                            "his": { "value": "0" },
                            "ins": { "value": "0" },
                            "inv": { "value": "0" },
                            "itm": { "value": "0" },
                            "med": { "value": "0" },
                            "nat": { "value": "0" },
                            "per": { "value": "0" },
                            "prc": { "value": "0" },
                            "prf": { "value": "0" },
                            "rel": { "value": "0" },
                            "slt": { "value": "0" },
                            "ste": { "value": "0" },
                            "sur": { "value": "0" }
                        },
                
                        "attributes": {
                            "ac": {
                                "value": "10",
                                "calc": "default"
                            },
                            "movement": {
                                "burrow": "0",
                                "climb": "0",
                                "fly": "0",
                                "swim": "0",
                                "walk": "30"
                            },
                            "senses": {
                                "darkvision": "0",
                                "blindsight": "0",
                                "truesight": "0"
                            },
                            "hp": {
                                "formula": "1d8 + 5",
                                "value": "10",
                                "max": "10"
                            },
                            "spellcasting": "int"
                        },
                
                        "details": {
                            "biography": { "value": "Generated biography" },
                            "alignment": "Neutral",
                            "cr": "1",
                            "spellLevel": "0",
                            "type": { "value": "humanoid" }
                        },
                
                        "traits": {
                            "size": "med",
                            "languages": { "value": ["common"] },
                            "ci": { "value": [] },
                            "di": { "value": [] },
                            "dr": { "value": [] },
                            "dv": { "value": [] }
                        }
                    }
                },
                "bonus": {
                    "bonus": {
                        "items": [],
                        "actions": [],
                        "spells": {},
                        "armor": []
                    }
                },
                "description": {
                    "dalle": "Generated description",
                    "background": "Generated background",
                    "affiliations": "Generated affiliations"
                }
            };
            
            // You might need to parse responseData and fill actorData accordingly
            // let actorData = parseGeminiResponse(responseData);

            let actor = [];
            actor.push(actorData.npc);
            actor.push(actorData.bonus);
            actor.push(actorData.description.dalle);
            return actor;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    static async callDallE(llmQuery) {
        const GOOGLE_CLOUD_API_KEY = game.settings.get(llmSettings.ID, llmSettings.SETTINGS.GOOGLE_CLOUD_API_KEY);
        const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/mythic-hulling-410621/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
    
        const data = {
            instances: [
                {
                    prompt: llmQuery
                }
            ],
            parameters: {
                sampleCount: 1
            }
        };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GOOGLE_CLOUD_API_KEY}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data)
            });
    
            const responseData = await response.json();
            // Assuming the response contains a base64 encoded image in the predictions array
            const base64Image = responseData.predictions[0].bytesBase64Encoded;
            return base64Image;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

      static async callChat(messages) {
        const GOOGLE_CLOUD_API_KEY = game.settings.get(llmSettings.ID, llmSettings.SETTINGS.GOOGLE_CLOUD_API_KEY);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-exp-1206:generateContent?key=${GOOGLE_CLOUD_API_KEY}`;
    
        // Adapt the messages to match Gemini's expected format
        const data = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: 'You are a helpful and creative DM assistant for 5th Edition Dungeons and Dragons. You help by giving story and character suggestions to the DM' }]
                },
                ...messages.map(message => ({
                    role: message.role === "user" ? "user" : "model",
                    parts: [{ text: message.content }]
                }))
            ]
        };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            const responseData = await response.json();
            // Extract the response text from Gemini's response
            // This is a placeholder, you'll need to adjust based on the actual Gemini response format
            const message = responseData.candidates[0].content.parts[0].text;
            return message;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

  static callPredetermined() {
    return this.elara;
  }

  static callPredeterminedImg() {
    return this.b64;
  }

  static helpfulAssistant = `
  You are a helpful and creative dm assistant for 5th Edition Dungeons and Dragons. You help by providing descriptions and stat blocks for NPCs in the specified JSON format. Output will include an NPC statblock, a short description that would be suitable for further GPT memories and image generation with Dall-E, a back story, items, attacks, spells and armor that may be relevent to the character (don't be afraid to add many), and any affiliations or relationships. You will only output the described attributes, without any fluff.

{
  "npc": {
      "name": "",
      "type": "npc",
      "system": {
          "abilities": {
              "str": { "value": "", "proficient": "0/1" },
              "dex": { "value": "", "proficient": "0/1" },
              "con": { "value": "", "proficient": "0/1" },
              "int": { "value": "", "proficient": "0/1" },
              "wis": { "value": "", "proficient": "0/1" },
              "cha": { "value": "", "proficient": "0/1" }
          },
  
          "skills": {
              "acr": { "value": "" }, (0.5 for half proficient, 1 for proficient, 2 for expertise)
              "ani": { "value": "" },
              "arc": { "value": "" },
              "ath": { "value": "" },
              "dec": { "value": "" },
              "his": { "value": "" },
              "ins": { "value": "" },
              "inv": { "value": "" },
              "itm": { "value": "" },
              "med": { "value": "" },
              "nat": { "value": "" },
              "per": { "value": "" },
              "prc": { "value": "" },
              "prf": { "value": "" },
              "rel": { "value": "" },
              "slt": { "value": "" },
              "ste": { "value": "" },
              "sur": { "value": "" }
          },
  
          "attributes": {
              "ac": {
                  "value": "",
                  "calc": "" (default, flat, natural)
              }"", (make sure to add armor below if ac is higher than normal)
              "movement": { (these should all be integer values)
                  "burrow": "",
                  "climb": "",
                  "fly": "",
                  "swim": "",
                  "walk": ""
              },
              "senses": { (these should all be interger values)
                  "darkvision": "",
                  "blindsight": "",
                  "truesight": ""
              },
              "hp": {
                  "formula": "",
                  "value": "",
                  "max": ""
              },
              "spellcasting": "(int/wis)"
          },
  
          "details": {
              "biography": { "value": "" },
              "alignment": "", (Full name, not an abbreviation)
              "cr": "", (If under 1, use a decimal for this cr level)
              "spellLevel": "",
              "type": { "value": "(ex:) humanoid" }
          },
  
          "traits": {
              "size": "(tiny/sm/med/lg/huge/grg)",
              "languages": { "value": [] },
              "ci": { "value": [] },
              "di": { "value": [] },
              "dr": { "value": [] },
              "dv": { "value": [] }
          }
      }
  },
  "bonus": {
      "bonus": {
          "items": [{
              "name": "",
              "type": "(consumable, equipment, backpack, loot, weapon, tool) (if it's an action, choose "weapon")",
              "system":{
                  "actionType": "",
                  "activation": { "type": "action"},
                  "attunement": "0/1",
                  "damage": {
                      "versatile": "(1d8 + @mod)"
                  }
              },
              "description": ""
          }],
          "actions": [{
              "name": "",
              "type": "(consumable, equipment, backpack, loot, weapon, tool) (if it's an action, choose "weapon")",
              "system":{
                  "actionType": "",
                  "activation": { "type": "action"},
                  "attunement": "0/1",
                  "damage": {
                      "versatile": "(1d8 + @mod)"
                  }
              },
              "description": ""
          }],
          "spells": {
              "0": [],
              "1": [], etc...
            },
          "armor": [{
              "name": "",
              "type": "(consumable, equipment, backpack, loot, weapon, tool) (if it's an action, choose "weapon")",
              "system": {
                  "armor": {
                      "type": "",
                      "value": "",
                      "dex": ""
                  }
              },
              "description": ""
          }]
      }
  },
  "description": {
      "dalle": "",
      "background": "",
      "affiliations": ""
  }
}
`;
}

// Initialize llmSettings
Hooks.once("init", () => {
  llmSettings.initialize();
});

// Example of a GET request using fetch in FoundryVTT
fetch("http://json.schemastore.org/launchsettings.json")
  .then((response) => {
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Data fetched:", data);
    // Handle the data here
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });

// Add extra secret settings
Hooks.on('renderSettingsConfig', (app, html, data) => {
    // Localization
    const apiKeyName = game.i18n.localize(`CHAT-BOT.settings.${llmSettings.SETTINGS.API_KEY}.Name`);
    const apiKeyHint = game.i18n.localize(`CHAT-BOT.settings.${llmSettings.SETTINGS.API_KEY}.Hint`);
    const secretKeyName = game.i18n.localize(`CHAT-BOT.settings.${llmSettings.SETTINGS.SECRET_KEY}.Name`);
    const secretKeyHint = game.i18n.localize(`CHAT-BOT.settings.${llmSettings.SETTINGS.SECRET_KEY}.Hint`);
    const googleCloudApiKeyName = game.i18n.localize(`CHAT-BOT.settings.${llmSettings.SETTINGS.GOOGLE_CLOUD_API_KEY}.Name`);
    const googleCloudApiKeyHint = game.i18n.localize(`CHAT-BOT.settings.${llmSettings.SETTINGS.GOOGLE_CLOUD_API_KEY}.Hint`);

    // Identify where to insert your custom field, e.g., at the end of the form
    const form = html.find(`[data-category="llm-lib"]`);
    const count = html.find(`[data-tab="llm-lib"]`);
    const updateCount = count.find(`[class="count"]`);
    updateCount.innerHTML = `[3]`;

    const apiKeyFormGroup = document.createElement('div');
    apiKeyFormGroup.classList.add('form-group');
    apiKeyFormGroup.innerHTML = `
        <label>${apiKeyName}:</label>
        <input type="password" name="${llmSettings.ID}.${llmSettings.SETTINGS.API_KEY}" value="${game.settings.get(llmSettings.ID, llmSettings.SETTINGS.API_KEY)}" data-dtype="String">
        <p class="notes">${apiKeyHint}</p>
    `;

    const secretKeyFormGroup = document.createElement('div');
    secretKeyFormGroup.classList.add('form-group');
    secretKeyFormGroup.innerHTML = `
        <label>${secretKeyName}:</label>
        <input type="password" name="${llmSettings.ID}.${llmSettings.SETTINGS.SECRET_KEY}" value="${game.settings.get(llmSettings.ID, llmSettings.SETTINGS.SECRET_KEY)}" data-dtype="String">
        <p class="notes">${secretKeyHint}</p>
    `;

    const googleCloudApiKeyFormGroup = document.createElement('div');
    googleCloudApiKeyFormGroup.classList.add('form-group');
    googleCloudApiKeyFormGroup.innerHTML = `
        <label>${googleCloudApiKeyName}:</label>
        <input type="password" name="${llmSettings.ID}.${llmSettings.SETTINGS.GOOGLE_CLOUD_API_KEY}" value="${game.settings.get(llmSettings.ID, llmSettings.SETTINGS.GOOGLE_CLOUD_API_KEY)}" data-dtype="String">
        <p class="notes">${googleCloudApiKeyHint}</p>
    `;

    // Append your custom form group to the settings window
    form.append(apiKeyFormGroup);
    form.append(secretKeyFormGroup);
    form.append(googleCloudApiKeyFormGroup);

    // Optionally, add an event listener to save the setting when the form is submitted
    // app.options.onSubmit = (e) => {
    //     e.preventDefault();
    //     const newSecretKey = e.target.querySelector(`input[name="${llmSettings.ID}.${llmSettings.SETTINGS.SECRET_KEY}"]`).value;
    //     game.settings.set('my-module-name', 'my-password', newSecretKey);
    // };
});
