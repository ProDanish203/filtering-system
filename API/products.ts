import { ProductType } from "@/types/types";
import { QueryResult } from "@upstash/vector";
import axios from "axios";

export const getProducts = async ({ filter }: { filter: { sort: string } }) => {
  try {
    const { data } = await axios.post<QueryResult<ProductType>[]>(`/api/products`, {
      filter: {
        sort: filter.sort,
      },
    });
    // @ts-ignore
    return data.products;
  } catch (error: any) {
    return {
      success: false,
      reposnse: error.response.data.message || "something went wrong",
    };
  }
};
