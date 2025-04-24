require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Builder, By, until } = require("selenium-webdriver");


const scrapeData = async (url) => {
  const chrome = require("selenium-webdriver/chrome");
  const options = new chrome.Options();
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      options.setPageLoadStrategy("normal"),
      options.addArguments("--headless=new")
    )
    .build();
  try {
    await driver.get(url);

    const closeButton = await driver.wait(
      until.elementLocated(By.className("close-button"))
    );
    closeButton.click();

    await driver.wait(
      until.elementLocated(By.xpath("//section[@class='neighborhood-info']"))
    );

    await driver.wait(
      until.elementsLocated(By.xpath("//ul[@class='lot-zoning-list']//li"))
    );

    const result = await driver.executeScript(() => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const getTextByXPath = (xpath) => {
        const elements = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        return Array.from(
          { length: elements.snapshotLength },
          (_, i) => elements.snapshotItem(i).innerText
        );
      };

      const getFirstTextByXPath = (xpath) => {
        const element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        return element ? element.innerText : "";
      };

      const getElement = (xpath) => {
        const element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        return element ? element.outerHTML : "";
      };

      const processText = (textArray) =>
        textArray.reduce((acc, item) => {
          item.split("\n").forEach((part, index, parts) => {
            if (index % 2 === 0) {
              const title = part.trim();
              const value = (parts[index + 1] || "").trim();
              if (title && value) acc[title] = value;
            }
          });
          return acc;
        }, {});

      const processTextFromHTML = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        return Array.from(doc.querySelectorAll("div.data-grid")).reduce(
          (acc, dataGrid) => {
            const title = dataGrid
              .querySelector("label.data-label")
              ?.textContent.trim();
            const value = dataGrid
              .querySelector("span.datum")
              ?.textContent.trim();

            if (title) acc[title] = value;
            return acc;
          },
          {}
        );
      };

      const scrapeDataText = async () => {
        await delay(5000);
        return {
          title: getFirstTextByXPath("//h1"),
          paragraphs: getTextByXPath("//p"),
          lot: processText(getTextByXPath("//section[@class='lot-details']")),
          neighborhood: processTextFromHTML(
            getElement("//section[@class='neighborhood-info']")
          ),
          lists: getTextByXPath("//section[@class='dynamic-lists']"),
          zoningDetails: getTextByXPath(
            "//ul[@class='lot-zoning-list']//li"
          ).map((item) => {
            const parts = item.split("\n");
            return parts[0];
          }).slice(1),
        };
      };

      return scrapeDataText();
    });
    return result;
  } finally {
    await driver.quit();
  }
};


const parseBBL = (bbl) => {
  try {
    const borough = parseInt(bbl[0], 10);
    const block = parseInt(bbl.slice(1, 6), 10);
    const lot = parseInt(bbl.slice(6), 10);
    return { borough, block, lot };
  } catch (e) {
    return null;
  }
};


const createZolaLotLink = (bbl, coordinates, zoomLevel = 19.21) => {
  try {
    const { borough, block, lot } = parseBBL(bbl);
    const [longitude, latitude] = coordinates;
    const baseUrl = `${process.env.CREATE_ZOLA}`;
    return `${baseUrl}/${borough}/${block}/${lot}?search=true`;
  } catch (e) {
    return null;
  }
};


const getLink = async (address) => {
  try {
    const userInput = `${address}`;
    let result;
    const baseUrl = `${process.env.ZOLA_LINK}`;
    console.log("baseUrl",baseUrl)
    const fullUrl = baseUrl + encodeURIComponent(userInput);

    const dataLink = await fetch(fullUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const bbl = data.features[0].properties.addendum.pad.bbl;
          const coordinates = data.features[0].geometry.coordinates;
          result = createZolaLotLink(bbl, coordinates);
        } else {
          throw new Error("No matching address found");
        }
        return result;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        return null;
      });
    return dataLink;
  } catch (e) {
    console.log("error at getLink", e);
    return null;
  }
};


const getAddressData = async (address) => {
  try {
    const zolaLink = await getLink(address);
    
    if (!zolaLink) {
      return {
        success: false,
        error: "Failed to generate ZOLA link for the provided address",
        data: null
      };
    }
    
    const scrapedData = await scrapeData(zolaLink);
    return {
      success: true,
      data: {
        address,
        zolaLink,
        ...scrapedData
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An error occurred while fetching data",
      data: null
    };
  }
};

module.exports = {
  getAddressData,
  scrapeData,
  getLink
}; 