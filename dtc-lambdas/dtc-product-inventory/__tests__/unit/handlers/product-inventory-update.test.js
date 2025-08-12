const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1'
});
if (process.env.NODE_ENV === 'local') {
    db.aws.ddb.local('http://localhost:8000');
}
const lambda = require('../../../src/handlers/product-inventory-update');
const dynamodb = require('aws-sdk/clients/dynamodb');


// This includes all tests for putItemHandler()
describe('Product Inventory Detail API test', () => {
    let putSpy;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
    beforeAll(() => {
        // Mock dynamodb get and put methods
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });

    // Clean up mocks
    afterAll(() => {
        putSpy.mockRestore();
    });

    it('Should validate inventory detail update request', async () => {
        const returnedItem = { 'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8', 'created_at': 1618919548900 };

        // Return the specified value whenever the spied put function is called
        putSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem)
        });
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ 'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8' })
        };
        // Invoke putItemHandler()
        const result = await lambda.ProductInventoryUpdateHandler(event);
        const expectedResult = {
            statusCode: 200,
            status: 0,
            body: JSON.stringify(returnedItem)
        };

        // Compare the result with the expected result
        expect(result.body.status).toEqual(expectedResult.body.status);
    });
    it('Should validate inventory detail update request', async () => {
        const returnedItem = { 'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8', 'created_at': 1618919548900 };

        // Return the specified value whenever the spied put function is called
        putSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem)
        });
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ 'created_at': 1618919548900 })
        };
        // Invoke putItemHandler()
        const result = await lambda.ProductInventoryUpdateHandler(event);
        const expectedResult = {
            statusCode: 200,
            status: 0,
            body: JSON.stringify(returnedItem)
        };

        // Compare the result with the expected result
        expect(result.body.status).toEqual(expectedResult.body.status);
    });
    // This test invokes putItemHandler() and compare the result
    it('Should update product inventory stock', async () => {
        const returnedItem = { 'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8', 'created_at': 1618919548900, 'stock': 50 };

        // Return the specified value whenever the spied put function is called
        putSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem)
        });
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ 'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8', 'created_at': 1618919548900, 'stock': 50 })
        };
        // Invoke putItemHandler()
        const result = await lambda.ProductInventoryUpdateHandler(event);
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(returnedItem)
        };

        // Compare the result with the expected result
        expect(result.statusCode).toEqual(expectedResult.statusCode);
    });
});
