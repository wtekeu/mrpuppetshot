const MrPuppetShot = require("./MrPuppetShot");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const { createServer } = require("http-server");

/** @type {import('http').Server} */
let server;

beforeAll(async () => {
  server = createServer({ root: __dirname + "/../test" });
  await new Promise(resolve => server.listen(3000, resolve));
});

test("pageScreenshot", async () => {
  const puppetshot = new MrPuppetShot({}, puppeteer);

  await puppetshot.navigate("http://127.0.0.1:3000/index.html");

  const buffer = await puppetshot.pageScreenshot();
  const testBuffer = await fs.readFile(__dirname + "/../test/page.png");
  puppetshot.close();

  const diff = buffer.compare(testBuffer);
  expect(diff).toBe(0);
});

test("viewportScreenshot", async () => {
  const puppetshot = new MrPuppetShot(
    {
      defaultViewport: {
        width: 1280,
        height: 720
      }
    },
    puppeteer
  );

  await puppetshot.navigate("http://127.0.0.1:3000/index.html");

  const buffer = await puppetshot.viewportScreenshot();
  const testBuffer = await fs.readFile(__dirname + "/../test/viewport.png");
  puppetshot.close();

  const diff = buffer.compare(testBuffer);
  expect(diff).toBe(0);
});

test("elementScreenshot", async () => {
  const puppetshot = new MrPuppetShot(
    {
      defaultViewport: { width: 2160, height: 1440 }
    },
    puppeteer
  );

  await puppetshot.navigate("http://127.0.0.1:3000/index.html");

  const buffer = await puppetshot.elementScreenshot(".side");
  const testBuffer = await fs.readFile(__dirname + "/../test/element.png");
  puppetshot.close();

  const diff = buffer.compare(testBuffer);
  expect(diff).toBe(0);
});

test("overrideStyles", async () => {
  const puppetshot = new MrPuppetShot({}, puppeteer);

  await puppetshot.navigate("http://127.0.0.1:3000/index.html");

  await puppetshot.overrideStyles({
    content:
      ".side { background-color: black; color: fuchsia; font-size: 2em; }"
  });

  const buffer = await puppetshot.elementScreenshot(".side");
  const testBuffer = await fs.readFile(
    __dirname + "/../test/override-styles.png"
  );
  puppetshot.close();

  const diff = buffer.compare(testBuffer);
  expect(diff).toBe(0);
});

test("excludeElements", async () => {
  const puppetshot = new MrPuppetShot({}, puppeteer);

  await puppetshot.navigate("http://127.0.0.1:3000/index.html");

  await puppetshot.excludeElements([".side > span + span", "h1"]);

  const buffer = await puppetshot.pageScreenshot();
  const testBuffer = await fs.readFile(
    __dirname + "/../test/exclude-elements.png"
  );
  puppetshot.close();

  const diff = buffer.compare(testBuffer);
  expect(diff).toBe(0);
});

afterAll(() => server.close());
