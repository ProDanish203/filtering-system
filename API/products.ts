import { ProductState } from "@/lib/validators";
import { ProductType } from "@/types/types";
import { QueryResult } from "@upstash/vector";
import axios from "axios";

export const getProducts = async (filter: ProductState) => {
  try {
    const { data } = await axios.post<QueryResult<ProductType>[]>(
      `/api/products`,
      {
        filter: {
          sort: filter.sort,
          color: filter.color,
          price: filter.price,
          size: filter.size,
        },
      }
    );
    // @ts-ignore
    return data.products;
  } catch (error: any) {
    return {
      success: false,
      reposnse: error.response.data.message || "something went wrong",
    };
  }
};
