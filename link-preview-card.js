/**
 * Copyright 2025 ChrisSarpong
 * @license Apache-2.0, see LICENSE for full text.
 * https://github.com/haxtheweb/issues/issues/1764 <- Directions for this component
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 *
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.herf = "";
    this.description = "";
    this.image = "";
    this.url = "";
    this.link = "";
    this.themeColor = defaultTheme();
    this.loadingState = false;

    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      herf: { type: String },
      description: { type: String },
      image: { type: String },
      url: { type: String },
      link: { type: String },
      themeColor: { type: String },
      loadingState: {
        type: Boolean,
        reflect: true,
        attribute: "loading-state",
      },
    };
  }

  async fetchData(link) {
    this.loadingState = true; // this is where the loading state
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }
      const json = await response.json();
      // adding in all of the posible data
      if (json.title) {
        this.title = json.title["title"];
      } else if (json.title === "og:title") {
        this.title = json.title["og:title"];
      } else if (json.title === "twitter:title") {
        this.title = json.title["twitter:title"];
      } else {
        this.title = "Not Found";
      }

      if (json.description) {
        this.description = json.description["description"];
      } else if (json.description === "og:description") {
        this.description = json.description["og:description"];
      } else if (json.description === "twitter:description") {
        this.description = json.description["twitter:description"];
      } else {
        this.description = "Not Found";
      }

      if (json.image) {
        this.image = json.image["logo"];
      } else if (json.image === "og:image") {
        this.image = json.image["og:image"];
      } else if (json.image === "twitter:image") {
        this.image = json.image["twitter:image"];
      } else {
        this.image = "Not Found";
      }

      if (json.url) {
        this.url = json.url["url"];
      } else {
        this.url = "Not Found";
      }

      if (json.themeColor) {
        this.themeColor = json.themeColor["themeColor"];
      } else {
        this.themeColor = defaultTheme;
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
      this.title = "Error finding website title";
      this.description = " ";
      this.image = " ";
      this.url = " ";
      this.themeColor = defaultTheme();
    } finally {
      this.loadingState = false;
    }
  }

  defaultTheme() {
    // might add loading state css here
    if (this.herf.includes("psu.edu")) {
      // not ddd-theme-primary
      return "var(--ddd-theme-2)";
    } else {
      return "var(--ddd-theme-15)";
    }
  }
  ImageError() {
    // handles cases where the image fails to load
    console.log("Image failed to load");
    this.image = " ";
    this.requestUpdate();
  }
  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        h3 span {
          font-size: var(
            --link-preview-card-label-font-size,
            var(--ddd-font-size-s)
          );
        }
        .link {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          border: 1px solid var(--ddd-theme-15);
          border-radius: var(--ddd-border-radius-1);
          padding: var(--ddd-spacing-2);
        }
        .img {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .img img {
          width: 100%;
          height: auto;
          border-radius: var(--ddd-border-radius-1);
        }
        .desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: var(--ddd-spacing-2);
        }
        .desc h3 {
          font-size: var(--ddd-font-size-l);
          margin: var(--ddd-spacing-2);
        }
        .desc p {
          font-size: var(--ddd-font-size-m);
          margin: var(--ddd-spacing-2);
        }
        .desc a {
          font-size: var(--ddd-font-size-m);
          margin: var(--ddd-spacing-2);
        }
        .desc a:hover {
          text-decoration: underline;
        }
        .loader {
          display: none;
          border: 16px solid var(--ddd-theme-default-skyLight);
          border-top: 16px solid var(--ddd-theme-default-slateMaxLight);
          border-bottom: 16px solid var(--ddd-theme-default-beaverBlue);
          border-radius: 50%;
          width: 120px;
          height: 120px;
          animation: spin 2s linear infinite;
          margin: auto;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .loading-state .loader {
          display: block;
        }
        .loading-state .wrapper {
          display: none;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`
      <div
        class="preview"
        style="--themeColor: ${this.themeColor}"
        part="preview"
      >
        ${this.loadingState
          ? html`<div class="loading-spinner" part="loading-spinner"></div>`
          : html`
              ${this.image
                ? html`<img
                    src="${this.image}"
                    alt=""
                    @error="${this.handleImageError}"
                    part="image"
                  />`
                : ""}
              <div class="content" part="content">
                <h3 class="title" part="title">${this.title}</h3>
                <details part="details">
                  <summary part="summary">Description</summary>
                  <p class="desc" part="desc">${this.description}</p>
                </details>
                <a href="${this.link}" target="_blank" class="url" part="url"
                  >Visit Site</a
                >
              </div>
            `}
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);
