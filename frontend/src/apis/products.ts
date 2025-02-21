import { BaseResponseDTO } from "@services/index";
import { ProductDTO } from "@services/products";

import { api } from "apis";

export const getProductById = async (id: number): Promise<BaseResponseDTO<ProductDTO>> => {
  return await api.get(`/products/${id}`);
};
