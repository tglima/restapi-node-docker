const jsonProducts = {
  products: [
    {
      id_product: 1,
      nm_product: 'Basic',
      vl_month_price: 14.99,
      nm_videoQuality: 'Good',
      nm_resolution: '480p',
      qt_simultaneous_screens: 1,
    },
    {
      id_product: 2,
      nm_product: 'Standard',
      vl_month_price: 34.99,
      nm_videoQuality: 'Better',
      nm_resolution: '1080p',
      qt_simultaneous_screens: 2,
    },
    {
      id_product: 3,
      nm_product: 'Premium',
      vl_month_price: 54.99,
      nm_videoQuality: 'Best',
      nm_resolution: '4K+HDR',
      qt_simultaneous_screens: 4,
    },
  ],
};

function findProductById(id_product) {
  const returnDTO = { status: 0, jsonBody: '' };

  if (!id_product || Number.isNaN(id_product)) {
    returnDTO.status = 400;
    returnDTO.jsonBody = {
      messages: ['id não informado ou inválido!'],
    };
    return returnDTO;
  }

  id_product = +id_product;

  const product = jsonProducts.products.find(
    (p) => p.id_product === id_product
  );

  if (!product) {
    returnDTO.status = 404;
    returnDTO.jsonBody = {
      messages: ['Item não encontrado!'],
    };
    return returnDTO;
  }

  returnDTO.status = 200;
  returnDTO.jsonBody = product;

  return returnDTO;
}

class ProductController {
  findAll(req, res) {
    return res.status(200).json(jsonProducts);
  }

  findById(req, res) {
    const { id } = req.params;
    const returnDTO = findProductById(id);
    return res.status(returnDTO.status).json(returnDTO.jsonBody);
  }
}

export default new ProductController();
