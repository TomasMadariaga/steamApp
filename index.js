import puppeteer from "puppeteer";

async function getDataFromGame() {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto("https://store.steampowered.com/app/271590/");

  await handleAgeRestriction(page);

  await page.waitForSelector(".apphub_AppName");
  // await page.waitForSelector(".game_purchase_price");
  await page.waitForSelector("div.game_area_purchase_game > h1");
  await page.waitForSelector(".discount_final_price");

  const result = await page.evaluate(() => {
    const title = document.querySelector(".apphub_AppName").innerText;
    // const price = document.querySelector(".game_purchase_price").innerText;
    const bundle_title = document.querySelector(
      "div.game_area_purchase_game > h1"
    ).innerText;
    const bundle_price = document.querySelector(
      ".discount_final_price"
    ).innerText;

    const game = {
      title,
      // price,
      bundle_title,
      bundle_price,
    };
    return game;
  });

  console.log(result);

  await browser.close();
}

getDataFromGame()
