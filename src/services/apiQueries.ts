import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiToken = createApi({
  reducerPath: 'apiToken',

  tagTypes: ['token'],
  //    invalidatesTags: ['billdata', 'devicedata', 'energy', 'consumo']
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://apisandbox.pagadetodo.com/v1/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getToken: builder.query({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body: new URLSearchParams({
          _operation: 'access_token',
          grant_type: 'client_credentials',
          client_id: 'censys',
          client_secret: 'c25867ddaed4801f6840d81a9b078af47dfeeaa1c18e12cb300022faa7ef5f28',
          ...body,
        }).toString()
      })
    })
  })
});

export const {useLazyGetTokenQuery} = apiToken;

export const apiQueries = createApi({
  reducerPath: 'apiQueries',

  tagTypes: ['saldo'],
  //    invalidatesTags: ['billdata', 'devicedata', 'energy', 'consumo']

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://apisandbox.pagadetodo.com/v1/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.query({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: new URLSearchParams({
          _operation: 'login',
          access_token: data.token,
          p_username: data.username,
          p_password: data.password
        }).toString()
      })
    }),
    getProducts: builder.query({
      query: (data) => ((console.log("data:",data)),{
        url: '/',
        method: 'POST',
        body: new URLSearchParams({
          _operation: 'getProducts',
          access_token: data.token,
          pvid: data.operatorid,
          sessionid: data.sessionid
        }).toString()
      })
    }),
    doCarga: builder.mutation({
      query: (data) => ((console.log("data:",data)),{
        url: '/',
        method: 'POST',
        body: new URLSearchParams({
          _operation: 'doCarga',
          access_token: data.access_token,
          pvid: data.pvid,
          sessionid: data.sessionid,
          productid: data.productid,
          numero: data.numero,
          importe: data.importe
        }).toString(),
        invalidatesTags: ['saldo']
      })
    }),
    getSaldoCliente: builder.query({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: new URLSearchParams({
          _operation: 'getSaldoCliente',
          access_token: data.token,
          pvid: data.operatorid,
          sessionid: data.sessionid
        }).toString(),
        providesTags: ['saldo']
      })
    })
  })
});

export const {useLazyLoginQuery, useGetProductsQuery, useDoCargaMutation, useLazyGetSaldoClienteQuery} = apiQueries;
