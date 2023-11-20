import productRepository from '../../../app/repository/product.repository';

describe('Test find products', () => {
  it('should return one Product', async () => {
    const respFindDB = await productRepository.findById(1);
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response.id_product : 0;
    expect(result).toEqual(1);
  });

  it('should return three Products', async () => {
    const respFindDB = await productRepository.findAll();
    const result =
      !respFindDB.error && respFindDB.response && respFindDB.response.products
        ? respFindDB.response.products.length
        : 'ERROR';
    expect(result).toEqual(3);
  });
});

describe('Test countProduct', () => {
  it('should return three Products', async () => {
    const respFindDB = await productRepository.countProduct();
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response : 'ERROR';
    expect(result).toEqual(3);
  });
});
