import productRepository from '../repository/sqlite/product.repository';
import constantUtil from '../utils/constant.util';

class ProductController {
  async findAll(req, res) {
    const responseMethod = await productRepository.getAllProducts();

    if (responseMethod.error) {
      return res.status(500).json({ messages: [constantUtil.MsgStatus500] });
    }

    if (!responseMethod.response) {
      return res.status(404).json({ messages: [constantUtil.MsgStatus404] });
    }

    const products = {
      items: responseMethod.response.map((product) => product.toJSON()),
    };

    return res.status(200).json(products);
  }

  async findById(req, res) {
    let { id } = req.params;
    id = +id;

    if (!id || !Number.isSafeInteger(id)) {
      return res.status(400).json({ messages: [constantUtil.MsgInvalidID] });
    }

    const responseMethod = await productRepository.getProductById(id);

    if (responseMethod.error) {
      return res.status(500).json({ messages: [constantUtil.MsgStatus500] });
    }

    if (!responseMethod.response) {
      return res.status(404).json({ messages: [constantUtil.MsgStatus404] });
    }

    return res.status(200).json(responseMethod.response.toJSON());
  }
}

export default new ProductController();
