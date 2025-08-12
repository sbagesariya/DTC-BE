const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1'
});
db.aws.ddb.local('http://localhost:8000');
const MockData = require('../migration-script/seed-data');
const UnitSeedData = require('./unit-seed-data');
const create = process.env.CREATE_TABLE === 'true';
const update = process.env.UPDATE_TABLE === 'true';
if (process.env.INDEX !== 'true') {
    var ProductAddresses = require('../model/products-addresses.model');
    var Products = require('../model/products.model');
    var Brands = require('../model/brand.model');
    var Templates = require('../model/templates.model');
    require('../model/cart.model');
    var AlcoholType = require('../model/alcohol-type.model');
    var BrandRecipes = require('../model/brand-recipes.model');
    var PromoCode = require('../model/promo-code.model');
    var Orders = require('../model/order.model');
    var Users = require('../model/user.model');
    var PortalUsers = require('../model/portal-user.model');
    var Menu = require('../model/menu.model');
    var Company = require('../model/company.model');
    var MenuPermissions = require('../model/menu-permissions.model');
    var TemplateMaster = require('../model/templates-master.model');
    var SavedTemplates = require('../model/saved-templates.model');
    var SizeVariants = require('../model/size-variants.model');
    var Inventory = require('../model/inventory.model');
    var OrderStatus = require('../model/order-status.model');
    var Retailer = require('../model/retailers.model');
    var SavedProducts = require('../model/saved_products.model');
    require('../model/retailers-addresses.model');
    var Role = require('../model/role.model');
    require('../model/brand-domains.model');
    var Market = require('./../model/markets.model');
    var FulfillmentInventory = require('./../model/fulfillment-inventory.model');
    var FulfillmentCenters = require('../model/fulfillment-centers.model');
    var TPpublicApiToken = require('./../model/public-api-tokens.model');
// DynamoDb client
} else if (process.env.INDEX === 'true') {
    require('../model/update-saved-products-indexes');
    require('../model/update-order.model');
    require('../model/update-size-variants.model');
    require('../model/update-inventory.model');
    require('../model/products-indexes.model');
}
if (process.env.SEED_DATA === 'true') {
    Promise.all([
        Brands.batchPut(MockData.brands),
        Templates.batchPut(MockData.templates),
        Products.batchPut(MockData.products),
        ProductAddresses.batchPut(MockData.productAddresses),
        BrandRecipes.batchPut(MockData.BrandRecipes),
        AlcoholType.batchPut(MockData.alcoholType),
        Products.batchPut(UnitSeedData.Products),
        ProductAddresses.batchPut(MockData.productAddressesNew),
        PromoCode.batchPut(MockData.PromoCode),
        PortalUsers.batchPut(MockData.PortalUsers),
        PortalUsers.batchPut(MockData.RetailerPortalUsers),
        Menu.batchPut(MockData.menu),
        MenuPermissions.batchPut(MockData.MenuPermissions),
        Company.batchPut(MockData.companies),
        TemplateMaster.batchPut(MockData.templateMaster),
        OrderStatus.batchPut(MockData.OrderStatus),
        Menu.batchPut(MockData.retailerMenu),
        MenuPermissions.batchPut(MockData.retailerMenuPermissions),
        Role.batchPut(MockData.Roles),
        Menu.batchPut(MockData.BrandProfileMenu),
        Retailer.batchPut(UnitSeedData.Retailers),
        Orders.batchPut(UnitSeedData.Orders),
        SavedProducts.batchPut(UnitSeedData.SavedProducts),
        SavedTemplates.batchPut(UnitSeedData.SavedTemplates),
        SizeVariants.batchPut(UnitSeedData.SizeVariants),
        Inventory.batchPut(UnitSeedData.Inventory),
        Market.batchPut(UnitSeedData.Markets),
        FulfillmentCenters.batchPut(MockData.FulfillmentCenters),
        TPpublicApiToken.batchPut(UnitSeedData.Public_api_tokens),
        Users.batchPut(UnitSeedData.Users),
        FulfillmentInventory.batchPut(MockData.FulfillmentInventory)
    ]).then(()=>{
        console.log('Seed data inserted successfully');
    }).catch(console.error);
}
