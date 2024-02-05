import puppeteer from "puppeteer";

async function handleAgeRestriction(p) {
  try {
    const ageGateSelectorExists = await p.$eval(
      ".agegate_birthday_selector",
      (el) => !!el
    );

    if (ageGateSelectorExists) {
      await p.evaluate(() => {
        const select = document.querySelector("#ageYear");
        const options = select.querySelectorAll("option");
        const selectedOption = [...options].find(
          (option) => option.text === "1900"
        );

        selectedOption.selected = true;
      });
    }

    await p.click("#view_product_page_btn");
  } catch (error) {
    console.error(error);
  }
}

async function getDataFromGame() {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  const appId = 221100;

  await page.goto(`https://store.steampowered.com/app/${appId}/`);

  await handleAgeRestriction(page);

  await page.waitForSelector("div.game_area_purchase_game");

  const result = await page.$$eval(".game_area_purchase_game", (els) =>
    els.map((bundle) => {
      const bundle_title = bundle.querySelector("h1")?.textContent.trim();
      const bundle_price = bundle
        .querySelector(".game_purchase_price")
        ?.textContent.trim();
      const bundle_discount_price = bundle.querySelector(
        ".discount_final_price"
      )?.textContent;

      if (bundle_price) {
        return {
          bundle_title,
          bundle_price,
        };
      } else if (bundle_discount_price) {
        return {
          bundle_title,
          bundle_discount_price,
        };
      }

      bundle
        .querySelector(".game_area_purchase_game_dropdown_selection")
        ?.click();
      return {
        bundle_title,
        bundle_prices: [
          ...bundle.querySelectorAll(
            ".game_area_purchase_game_dropdown_menu_item_text"
          ),
        ].map((e) => e.textContent),
      };
    })
  );

  console.log(result);

  await browser.close();
}

getDataFromGame();
