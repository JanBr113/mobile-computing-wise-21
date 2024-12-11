const amazonPaapi = require("amazon-paapi");

const commonParameters = {
  AccessKey: "AKIAJKCRJMDZKWFT3NOQ",
  SecretKey: "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",
  PartnerTag: "ravix0c-21",
  PartnerType: "Associates",
  Marketplace: "www.amazon.de",
};

let requestParameters = {
  SearchIndex: "All",
  ItemCount: 5,
  Resources: [
    "Images.Primary.Large",
    "ItemInfo.Title",
    "Offers.Listings.Price",
    "Offers.Listings.Availability.Type",
    "CustomerReviews.StarRating",
    "BrowseNodeInfo.BrowseNodes.SalesRank",
    "ItemInfo.Features",
    "ItemInfo.ProductInfo",
    "ItemInfo.TechnicalInfo",
  ],
};

exports.getItemsFromAmazonByKeyword = (productsArray) => {
  return new Promise(async (resolve) => {
    requestParameters.Keywords = productsArray;
    try {
      let data = await amazonPaapi.SearchItems(
        commonParameters,
        requestParameters
      );
      resolve(data);
    } catch (error) {
      console.log("paapi Error: " + error);
      reject(error);
    }
  });
};
