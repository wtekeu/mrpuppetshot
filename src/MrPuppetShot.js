const Puppeteer = require("puppeteer-core");

/**
 * @typedef {object} ScreenshotOptions
 * @property {boolean} [omitBackground]
 * @property {"png"|"jpeg"} [type]
 * @property {number} [quality]
 */

/**
 * @typedef {object} ViewportScreenshotOptions
 * @property {Puppeteer.BoundingBox} [clip]
 */

class MrPuppetShot {
  /**
   * @param {Puppeteer.LaunchOptions} options
   * @param {Puppeteer} [instance]
   */
  constructor(options, instance) {
    this.browser = instance.launch(options);
  }

  /**
   * @param {string} url
   * @param {Puppeteer.DirectNavigationOptions} [options]
   */
  async navigate(url, options) {
    if (!this.page) {
      this.page = await (await this.browser).newPage();
    }
    return this.page.goto(url, options);
  }

  /**
   * @param {object} size
   * @param {number} [size.width]
   * @param {number} [size.height]
   */
  async resizeViewport({
    width = this.page.viewport().width,
    height = this.page.viewport().height
  }) {
    if (!this.page) {
      this.page = await (await this.browser).newPage();
    }
    return this.page.setViewport({ width, height });
  }

  /**
   * @param {Puppeteer.StyleTagOptions} options
   */
  async overrideStyles(options) {
    return this.page.addStyleTag(options);
  }

  /**
   * @param {string[]} selectors
   */
  async excludeElements(selectors) {
    return this.page.evaluate(
      selectors =>
        selectors.forEach(selector =>
          document.querySelectorAll(selector).forEach(elem => elem.remove())
        ),
      selectors
    );
  }

  /**
   * @param {ScreenshotOptions & ViewportScreenshotOptions} [options]
   */
  async viewportScreenshot(options) {
    const { clip, omitBackground, quality, type } = options || {};

    return this.page.screenshot({
      clip,
      omitBackground,
      quality,
      type
    });
  }

  /**
   * @param {ScreenshotOptions} [options]
   */
  async pageScreenshot(options) {
    const { omitBackground, quality, type } = options || {};

    const [width, height] = await this.page.evaluate(() => {
      const w = document.querySelector("body").scrollWidth;
      const h = document.querySelector("body").scrollHeight;
      return [w, h];
    });

    await this.page.setViewport({ width, height });

    return this.page.screenshot({
      omitBackground,
      quality,
      type,
      fullPage: true
    });
  }

  /**
   * @param {string} selector
   * @param {ScreenshotOptions} [options]
   */
  async elementScreenshot(selector, options) {
    const element = await this.page.$(selector);

    const { omitBackground, quality, type } = options || {};

    return element.screenshot({
      omitBackground,
      quality,
      type
    });
  }

  async close() {
    (await this.browser).close();
  }
}

module.exports = MrPuppetShot;
