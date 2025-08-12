const ProductAddresses = require('../model/products-addresses.model');
const Products = require('../model/products.model');
const Brands = require('../model/brand.model');
const Templates = require('../model/templates.model');
require('../model/cart.model');
const AlcoholType = require('../model/alcohol-type.model');
const BrandRecipes = require('../model/brand-recipes.model');
const PromoCode = require('../model/promo-code.model');
require('./../model/order.model');
require('./../model/user.model');
const PortalUsers = require('../model/portal-user.model');
const Menu = require('../model/menu.model');
const Company = require('../model/company.model');
const MenuPermissions = require('../model/menu-permissions.model');
const TemplateMaster = require('../model/templates-master.model');
require('../model/saved-templates.model');
require('./../model/update-order.model');
const SizeVariants = require('../model/size-variants.model');
require('../model/update-size-variants.model');
require('../model/inventory.model');
require('../model/update-inventory.model');
require('./../model/products-indexes.model');
const OrderStatus = require('../model/order-status.model');
require('../model/retailers.model');
require('./../model/saved_products.model');
require('./../model/update-saved-products-indexes');
require('../model/retailers-addresses.model');
const Role = require('./../model/role.model');
require('./../model/brand-domains.model');
const Markets = require('./../model/markets.model');
const FulfillmentCenters = require('../model/fulfillment-centers.model');
const FulfillmentInventory = require('../model/fulfillment-inventory.model');
const AutoIncrement = require('./../model/auto_increment.model');
require('../model/update-fulfillment-inventory.model');
require('./../model/public-api-tokens.model');
require('./../model/ship-compliant-order-log.model');
require('./../model/order-transactions.model');
const MockData = require('./seed-data');

var db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1'
});
if (process.env.NODE_ENV === 'local') {
    db.aws.ddb.local('http://localhost:8000');
}
// DynamoDb client

if (process.env.SEED_DATA === 'true') {
    Promise.all([
        Brands.batchPut(MockData.brands),
        Templates.batchPut(MockData.templates),
        Products.batchPut(MockData.products),
        ProductAddresses.batchPut(MockData.productAddresses),
        BrandRecipes.batchPut(MockData.BrandRecipes),
        AlcoholType.batchPut(MockData.alcoholType),
        Products.batchPut(MockData.productsNew),
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
        Markets.batchPut(MockData.Markets1),
        Markets.batchPut(MockData.Markets2),
        Markets.batchPut(MockData.Markets3),
        PortalUsers.batchPut(MockData.FulfillmentPortalUsers),
        FulfillmentCenters.batchPut(MockData.FulfillmentCenters),
        Products.batchPut(MockData.FulfillmentProducts),
        SizeVariants.batchPut(MockData.FulfillmentSizeVariants),
        FulfillmentInventory.batchPut(MockData.FulfillmentInventory),
        Menu.batchPut(MockData.FulfillmentCenterMenu),
        AutoIncrement.batchPut(MockData.AutoIncrement),
        Products.batchPut(MockData.ShipCompliantProducts),
        SizeVariants.batchPut(MockData.ShipCompliantSizeVariants)
    ]).then(()=>{
        console.log('Seed data inserted successfully');
    }).catch(console.error);
}
