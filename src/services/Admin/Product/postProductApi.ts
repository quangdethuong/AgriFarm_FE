'use client';
import {
  LandProd,
  Product,
  SeedPro
} from '@/app/[locale]/(Dashboard)/(Admin)/season/models/season-model';
// import { payLoadResponse } from '@/redux/features/season-slice';
import HttpResponseCommon from '@/types/response';
import { http } from '@/utils/config';
import { Axios, AxiosInstance } from 'axios';
import { cookies } from 'next/headers';

export type CreateProductDto = {
  land: LandProd | null;
  seed: SeedPro | null | undefined;
};

export const createProductApi: (
  http: AxiosInstance | null,
  seasonId?: string | undefined,
  createProductDto?: CreateProductDto
) => Promise<HttpResponseCommon<Product | [] | undefined>> = async (
  http,
  seasonId,
  createProductDto
) => {
  try {
    const res = await http?.post(`cult/products/post`, createProductDto, {
      params: {
        seasonId: seasonId
      }
    });
    console.log(res);
    return res?.data;
  } catch (error: unknown) {
    // Assert the type of error to be an instance of Error
    if (error instanceof Error) {
      throw new Error(`Error calling API: ${error.message}`);
    } else {
      throw new Error(`Unknown error occurred: ${error}`);
    }
  }
};

// export const createProductApiSlice: (
//   http: AxiosInstance | null,
//   seasonId?: string | undefined,
//   createProductDto?: CreateProductDto
// ) => Promise<HttpResponseCommon<payLoadResponse[] | [] | undefined>> = async (
//   http,
//   seasonId,
//   createProductDto
// ) => {
//   try {
//     const res = await http?.post(`cult/products/post`, createProductDto, {
//       params: {
//         seasonId: seasonId
//       }
//     });
//     console.log(res);
//     return res?.data;
//   } catch (error: unknown) {
//     // Assert the type of error to be an instance of Error
//     if (error instanceof Error) {
//       throw new Error(`Error calling API: ${error.message}`);
//     } else {
//       throw new Error(`Unknown error occurred: ${error}`);
//     }
//   }
// };
